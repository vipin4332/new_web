// Email Service using Brevo with Attachment Support
const axios = require('axios');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Tenx Registration';

async function sendEmailWithAttachment(to, subject, htmlContent, pdfBuffer, fileName) {
    if (!BREVO_API_KEY || !SENDER_EMAIL) {
        throw new Error('Brevo email service is not configured. Please set BREVO_API_KEY and BREVO_SENDER_EMAIL environment variables.');
    }

    try {
        // Convert PDF buffer to base64
        const pdfBase64 = pdfBuffer.toString('base64');

        const emailData = {
            sender: {
                name: SENDER_NAME,
                email: SENDER_EMAIL
            },
            to: [{
                email: to
            }],
            subject: subject,
            htmlContent: htmlContent,
            textContent: htmlContent.replace(/<[^>]*>/g, ''), // Strip HTML for text version
            attachments: [{
                name: fileName,
                content: pdfBase64
            }]
        };

        console.log(`📧 Sending email with attachment to: ${to}`);
        console.log(`📎 Attachment: ${fileName} (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);

        const response = await axios.post(BREVO_API_URL, emailData, {
            headers: {
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json'
            },
            timeout: 60000 // 60 second timeout for email with attachment (PDF generation can take time)
        });

        console.log(`✅ Email sent successfully to: ${to}`);
        return response.data;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        if (error.response) {
            console.error('❌ Brevo API Error:', error.response.data);
            throw new Error(error.response.data?.message || 'Failed to send email');
        }
        throw error;
    }
}

module.exports = { sendEmailWithAttachment };

