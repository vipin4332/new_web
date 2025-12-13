// Form submission endpoint for Vercel
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get form data
        // Note: For FormData with file uploads, you'll need to use a library like 'formidable' or 'multer'
        // For now, we'll handle JSON or URL-encoded data
        let formData = req.body;
        
        // If body is a string, try to parse it
        if (typeof formData === 'string') {
            try {
                formData = JSON.parse(formData);
            } catch (e) {
                // If not JSON, it might be URL-encoded
                formData = {};
            }
        }

        // Validate required fields
        if (!formData.email || !formData.applicant_name) {
            return res.status(400).json({
                success: false,
                message: 'Required fields are missing'
            });
        }

        // Validate email match if confirm_email is provided
        if (formData.confirm_email && formData.email !== formData.confirm_email) {
            return res.status(400).json({
                success: false,
                message: 'Email addresses do not match'
            });
        }

        // Generate a submission ID
        const submissionId = 'TENX-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        // Log the submission (in production, you would save to database)
        console.log('📝 Form submission received:', {
            id: submissionId,
            email: formData.email,
            applicant_name: formData.applicant_name,
            timestamp: new Date().toISOString()
        });

        // In production, you would:
        // 1. Save form data to database
        // 2. Process file uploads
        // 3. Send confirmation email
        // 4. Integrate with payment gateway

        // Return success response
        res.json({
            success: true,
            message: 'Form submitted successfully! Your application has been received.',
            id: submissionId,
            data: {
                submittedAt: new Date().toISOString(),
                applicantName: formData.applicant_name,
                email: formData.email
            }
        });

    } catch (error) {
        console.error('❌ Form submission error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Failed to submit form. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

