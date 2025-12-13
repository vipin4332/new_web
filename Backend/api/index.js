// Root route handler for Vercel
// This handles requests to the root URL (/)
module.exports = async (req, res) => {
    try {
        // Set CORS headers first
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Handle OPTIONS request (CORS preflight)
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        // Only allow GET requests for root
        if (req.method !== 'GET') {
            return res.status(405).json({ 
                status: 'error',
                error: 'Method not allowed',
                message: 'Only GET requests are allowed on the root route'
            });
        }

        // Return friendly JSON response
        return res.status(200).json({ 
            status: 'backend running',
            version: '1.0'
        });
    } catch (error) {
        console.error('❌ Root route error:', error);
        console.error('❌ Error stack:', error.stack);
        return res.status(500).json({ 
            status: 'error',
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

