const axios = require('axios');

// Brevo API configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// Send OTP via Email using Brevo
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
        const { email } = req.body;

        // Validate email
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Valid email address is required'
            });
        }

        // Check if Brevo is configured
        if (!BREVO_API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'Email service is not configured. Please set BREVO_API_KEY in environment variables.'
            });
        }

        // Check if sender email is configured
        const senderEmail = process.env.BREVO_SENDER_EMAIL;
        if (!senderEmail || senderEmail === 'noreply@tenx.com') {
            return res.status(400).json({
                success: false,
                message: 'Valid sender email required. Please set BREVO_SENDER_EMAIL in Vercel environment variables and verify the email in Brevo.'
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

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

        // Send email using Brevo API
        if (!BREVO_API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'Brevo API key is not configured. Please set BREVO_API_KEY in Vercel environment variables.'
            });
        }

        console.log('📧 Sending email via Brevo to:', email);
        console.log('📧 Using sender email:', senderEmail);
        
        await axios.post(BREVO_API_URL, emailData, {
            headers: {
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log(`✅ OTP sent successfully to: ${email}`);

        // Return success response with OTP for frontend verification
        // Note: In production, you might want to verify OTP on backend instead
        res.json({
            success: true,
            message: 'OTP sent successfully to your email',
            otp: otp // Send OTP back so frontend can verify it
        });

    } catch (error) {
        console.error('❌ Error sending OTP:', error);
        
        // Handle Brevo API errors
        if (error.response) {
            const errorMessage = error.response.data?.message || 'Failed to send OTP email';
            
            // Provide helpful error messages
            let userMessage = errorMessage;
            if (errorMessage.includes('sender') || errorMessage.includes('email')) {
                userMessage = 'Sender email not verified. Please verify your sender email in Brevo dashboard and set BREVO_SENDER_EMAIL in Vercel environment variables.';
            }
            
            return res.status(error.response.status || 500).json({
                success: false,
                message: userMessage,
                error: process.env.NODE_ENV === 'development' ? error.response.data : undefined
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to send OTP. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

