// Health check endpoint for Vercel
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

        // Return health status
        res.status(200).json({
            status: 'ok',
            message: 'Server is running',
            timestamp: new Date().toISOString(),
            environment: {
                brevoConfigured: brevoConfigured,
                senderEmailConfigured: senderEmailConfigured,
                nodeEnv: process.env.NODE_ENV || 'production'
            }
        });
    } catch (error) {
        console.error('❌ Health check error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Health check failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

