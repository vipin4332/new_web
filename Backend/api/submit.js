// Form submission endpoint for Vercel
module.exports = async (req, res) => {
    try {
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
            return res.status(405).json({ 
                status: 'error',
                error: 'Method not allowed',
                message: 'Only POST requests are allowed'
            });
        }

        // Log request
        console.log('📝 Form submission received at:', new Date().toISOString());
        console.log('📝 Request method:', req.method);
        console.log('📝 Content-Type:', req.headers['content-type']);

        // Get form data
        // Note: For FormData with file uploads, you'll need to use a library like 'formidable' or 'multer'
        // For now, we'll handle JSON or URL-encoded data
        let formData = req.body;
        
        // Handle missing body
        if (!formData) {
            console.warn('⚠️ Request body is missing');
            formData = {};
        }
        
        // If body is a string, try to parse it
        if (typeof formData === 'string') {
            try {
                formData = JSON.parse(formData);
                console.log('📝 Parsed JSON body');
            } catch (e) {
                console.warn('⚠️ Failed to parse JSON body, treating as empty');
                formData = {};
            }
        }

        // Handle multipart/form-data (basic handling)
        if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
            console.log('📝 Multipart form data detected (file uploads may not be fully processed)');
            // For full file upload support, you would need to use formidable or multer
            // For now, we'll extract text fields if possible
            // Vercel automatically parses multipart data, but file handling needs additional libraries
        }

        // Validate required fields
        if (!formData.email) {
            console.error('❌ Email is missing in form submission');
            return res.status(400).json({
                success: false,
                status: 'error',
                message: 'Email address is required'
            });
        }

        if (!formData.applicant_name) {
            console.error('❌ Applicant name is missing in form submission');
            return res.status(400).json({
                success: false,
                status: 'error',
                message: 'Applicant name is required'
            });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            console.error('❌ Invalid email format:', formData.email);
            return res.status(400).json({
                success: false,
                status: 'error',
                message: 'Invalid email address format'
            });
        }

        // Validate email match if confirm_email is provided
        if (formData.confirm_email && formData.email !== formData.confirm_email) {
            console.error('❌ Email addresses do not match');
            return res.status(400).json({
                success: false,
                status: 'error',
                message: 'Email addresses do not match'
            });
        }

        // Generate a submission ID
        const submissionId = 'TENX-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        // Log the submission (in production, you would save to database)
        console.log('✅ Form submission processed:', {
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
        return res.status(200).json({
            success: true,
            status: 'ok',
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
        console.error('❌ Error details:', {
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
        
        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'Failed to submit form. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

