// Health check endpoint for Vercel with MongoDB connection test
const { connectToDatabase } = require('./lib/mongodb');

module.exports = async (req, res) => {
    try {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Handle OPTIONS request
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }

        // Only allow GET requests
        if (req.method !== 'GET') {
            return res.status(405).json({ 
                status: 'error',
                error: 'Method not allowed',
                message: 'Only GET requests are allowed'
            });
        }

        // Log health check request
        console.log('✅ Health check requested at:', new Date().toISOString());

        // Check environment variables
        const brevoConfigured = !!process.env.BREVO_API_KEY;
        const senderEmailConfigured = !!process.env.BREVO_SENDER_EMAIL;
        const mongodbUriConfigured = !!process.env.MONGODB_URI;
        const mongodbDbConfigured = !!process.env.MONGODB_DB;

        // Test MongoDB connection (with timeout to avoid blocking)
        let mongodbStatus = 'not_configured';
        let mongodbError = null;
        
        if (mongodbUriConfigured) {
            try {
                // Use Promise.race to timeout after 5 seconds
                const connectionPromise = connectToDatabase().then(async ({ db }) => {
                    await db.admin().ping();
                    return 'connected';
                });
                
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Connection timeout')), 5000)
                );
                
                mongodbStatus = await Promise.race([connectionPromise, timeoutPromise]);
                console.log('✅ MongoDB connection test successful');
            } catch (mongoError) {
                mongodbStatus = 'error';
                mongodbError = mongoError.message;
                console.error('❌ MongoDB connection test failed:', mongoError);
            }
        }

        // Return health status
        return res.status(200).json({
            status: 'ok',
            message: 'Server is running',
            timestamp: new Date().toISOString(),
            environment: {
                brevoConfigured: brevoConfigured,
                senderEmailConfigured: senderEmailConfigured,
                mongodbUriConfigured: mongodbUriConfigured,
                mongodbDbConfigured: mongodbDbConfigured,
                mongodbStatus: mongodbStatus,
                mongodbError: mongodbError,
                nodeEnv: process.env.NODE_ENV || 'production'
            }
        });
    } catch (error) {
        console.error('❌ Health check error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Health check failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

