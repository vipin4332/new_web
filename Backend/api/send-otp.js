const axios = require('axios');

// Brevo API configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// Send OTP via Email using Brevo
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
        console.log('📧 OTP request received at:', new Date().toISOString());
        console.log('📧 Request method:', req.method);
        console.log('📧 Request body:', req.body);

        // Parse request body
        // Vercel automatically parses JSON bodies, but we need to handle edge cases
        let email;
        try {
            if (!req.body) {
                console.error('❌ Request body is missing');
                return res.status(400).json({
                    success: false,
                    status: 'error',
                    message: 'Request body is required'
                });
            }

            if (typeof req.body === 'string') {
                try {
                    const parsed = JSON.parse(req.body);
                    email = parsed.email;
                } catch (parseError) {
                    console.error('❌ Error parsing JSON string:', parseError);
                    return res.status(400).json({
                        success: false,
                        status: 'error',
                        message: 'Invalid JSON in request body'
                    });
                }
            } else if (typeof req.body === 'object') {
                email = req.body.email;
            } else {
                console.error('❌ Unexpected body type:', typeof req.body);
                return res.status(400).json({
                    success: false,
                    status: 'error',
                    message: 'Invalid request body format'
                });
            }
        } catch (parseError) {
            console.error('❌ Error parsing request body:', parseError);
            return res.status(400).json({
                success: false,
                status: 'error',
                message: 'Invalid request body. Expected JSON with email field.'
            });
        }

        // Validate email
        if (!email) {
            console.error('❌ Email is missing in request');
            return res.status(400).json({
                success: false,
                status: 'error',
                message: 'Email address is required'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            console.error('❌ Invalid email format:', email);
            return res.status(400).json({
                success: false,
                status: 'error',
                message: 'Valid email address is required'
            });
        }

        // Check if Brevo is configured
        if (!BREVO_API_KEY) {
            console.error('❌ BREVO_API_KEY is not configured');
            return res.status(500).json({
                success: false,
                status: 'error',
                message: 'Email service is not configured. Please set BREVO_API_KEY in environment variables.'
            });
        }

        // Check if sender email is configured
        const senderEmail = process.env.BREVO_SENDER_EMAIL;
        if (!senderEmail || senderEmail === 'noreply@tenx.com') {
            console.error('❌ BREVO_SENDER_EMAIL is not configured or invalid:', senderEmail);
            return res.status(400).json({
                success: false,
                status: 'error',
                message: 'Valid sender email required. Please set BREVO_SENDER_EMAIL in Vercel environment variables and verify the email in Brevo.'
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('🔐 Generated OTP for:', email);

        // Email content
        const emailData = {
            sender: {
                name: process.env.BREVO_SENDER_NAME || 'Tenx Registration',
                email: senderEmail
            },
            to: [{
                email: email
            }],
            subject: 'Your Tenx Registration OTP',
            htmlContent: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #007BFF, #0d46ff); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                        .otp-box { background: white; border: 2px dashed #007BFF; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                        .otp-code { font-size: 32px; font-weight: bold; color: #007BFF; letter-spacing: 5px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Tenx Registration</h1>
                        </div>
                        <div class="content">
                            <h2>Your OTP Verification Code</h2>
                            <p>Hello,</p>
                            <p>Thank you for registering with Tenx. Please use the following OTP to verify your email address:</p>
                            
                            <div class="otp-box">
                                <div class="otp-code">${otp}</div>
                            </div>
                            
                            <p><strong>This OTP will expire in 5 minutes.</strong></p>
                            <p>If you didn't request this OTP, please ignore this email.</p>
                            
                            <div class="footer">
                                <p>© 2025 Tenx. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            textContent: `Your Tenx Registration OTP is: ${otp}\n\nThis OTP will expire in 5 minutes.\n\nIf you didn't request this OTP, please ignore this email.`
        };

        console.log('📧 Sending email via Brevo to:', email);
        console.log('📧 Using sender email:', senderEmail);
        console.log('📧 Brevo API URL:', BREVO_API_URL);
        console.log('📧 Generated OTP:', otp);
        
        // Send email using Brevo API
        const brevoResponse = await axios.post(BREVO_API_URL, emailData, {
            headers: {
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout for email sending
        });

        console.log(`✅ OTP sent successfully to: ${email}`);
        console.log('✅ Brevo response status:', brevoResponse.status);
        console.log('✅ Brevo response data:', brevoResponse.data);

        // Return success response with OTP for frontend verification
        // Note: In production, you might want to verify OTP on backend instead
        return res.status(200).json({
            success: true,
            status: 'ok',
            message: 'OTP sent successfully to your email',
            otp: otp // Send OTP back so frontend can verify it
        });

    } catch (error) {
        console.error('❌ Error sending OTP:', error);
        console.error('❌ Error details:', {
            message: error.message,
            code: error.code,
            response: error.response ? {
                status: error.response.status,
                data: error.response.data
            } : null,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
        
        // Handle Brevo API errors
        if (error.response) {
            const errorMessage = error.response.data?.message || 'Failed to send OTP email';
            const errorCode = error.response.data?.code;
            
            // Provide helpful error messages
            let userMessage = errorMessage;
            if (errorMessage.includes('sender') || errorMessage.includes('email') || errorCode === 'invalid_parameter') {
                userMessage = 'Sender email not verified. Please verify your sender email in Brevo dashboard and set BREVO_SENDER_EMAIL in Vercel environment variables.';
            } else if (errorMessage.includes('authentication') || errorCode === 'unauthorized') {
                userMessage = 'Brevo API key is invalid or not set. Please check BREVO_API_KEY in Vercel environment variables.';
            } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                userMessage = 'Request timeout. Please try again later.';
            }
            
            return res.status(error.response.status || 500).json({
                success: false,
                status: 'error',
                message: userMessage,
                error: process.env.NODE_ENV === 'development' ? error.response.data : undefined
            });
        }

        // Handle network errors
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            return res.status(503).json({
                success: false,
                status: 'error',
                message: 'Email service is temporarily unavailable. Please try again later.'
            });
        }

        // Generic error
        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'Failed to send OTP. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

