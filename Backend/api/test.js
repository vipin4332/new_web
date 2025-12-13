// Test endpoint to verify CORS and function detection
module.exports = async (req, res) => {
    try {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Handle OPTIONS request
        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }

        console.log('🧪 Test endpoint called:', req.method, new Date().toISOString());

        return res.status(200).json({
            status: 'ok',
            message: 'Test endpoint is working',
            method: req.method,
            timestamp: new Date().toISOString(),
            environment: {
                nodeEnv: process.env.NODE_ENV || 'production'
            }
        });
    } catch (error) {
        console.error('❌ Test endpoint error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Test endpoint error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

