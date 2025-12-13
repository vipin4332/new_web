// Root route handler for Vercel
module.exports = async (req, res) => {
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

    // Only allow GET requests for root
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            status: 'error',
            error: 'Method not allowed',
            message: 'Only GET requests are allowed on the root route'
        });
    }

    try {
        // Return simple status response
        res.status(200).json({ 
            status: 'backend running',
            timestamp: new Date().toISOString(),
            endpoints: {
                health: '/api/health',
                sendOtp: '/api/send-otp',
                submit: '/api/submit'
            }
        });
    } catch (error) {
        console.error('❌ Root route error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

