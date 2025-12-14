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
        // Validate PDF buffer
        if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
            throw new Error('Invalid PDF buffer provided');
        }

        if (pdfBuffer.length === 0) {
            throw new Error('PDF buffer is empty');
        }

        // Validate PDF size (Brevo limit is typically 4MB, we'll use 3.5MB as safe limit)
        const maxPdfSize = 3.5 * 1024 * 1024; // 3.5 MB in bytes
        if (pdfBuffer.length > maxPdfSize) {
            throw new Error(`PDF attachment is too large: ${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB. Maximum allowed: 3.5 MB`);
        }

        console.log(`📧 Preparing email with attachment to: ${to}`);
        console.log(`📎 Attachment: ${fileName} (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);
        console.log(`📎 PDF buffer type: ${typeof pdfBuffer}, isBuffer: ${Buffer.isBuffer(pdfBuffer)}`);

        // Convert PDF buffer to base64 (Brevo requires base64 encoded attachments)
        // ✅ Using in-memory buffer (no file system access)
        // ✅ Converting to base64 string (not sending raw Buffer)
        // ✅ All operations are async (non-blocking)
        const pdfBase64 = pdfBuffer.toString("base64");
        console.log(`📎 Base64 conversion successful`);
        console.log(`📎 Base64 length: ${pdfBase64.length} characters`);
        console.log(`📎 Base64 preview (first 50 chars): ${pdfBase64.substring(0, 50)}...`);

        // Brevo API format for attachments
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

        console.log(`📤 Sending email via Brevo API...`);
        console.log(`📤 Email data keys:`, Object.keys(emailData));
        console.log(`📤 Attachment present:`, emailData.attachments ? 'Yes' : 'No');
        console.log(`📤 Attachment name:`, emailData.attachments[0]?.name);
        console.log(`📤 Attachment content length:`, emailData.attachments[0]?.content?.length || 0);

        const response = await axios.post(BREVO_API_URL, emailData, {
            headers: {
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 60000 // 60 second timeout for email with attachment (PDF generation can take time)
        });

        console.log(`✅ Email sent successfully to: ${to}`);
        console.log(`✅ Brevo response status:`, response.status);
        console.log(`✅ Brevo response data:`, JSON.stringify(response.data));

        return response.data;
    } catch (error) {
        console.error('❌ Error sending email with attachment:', error);
        if (error.response) {
            console.error('❌ Brevo API Error Status:', error.response.status);
            console.error('❌ Brevo API Error Data:', JSON.stringify(error.response.data, null, 2));
            throw new Error(`Brevo API error: ${error.response.data?.message || JSON.stringify(error.response.data) || 'Unknown error'}`);
        }
        if (error.request) {
            console.error('❌ No response received from Brevo API');
            throw new Error('No response from Brevo API. Please check your network connection.');
        }
        throw error;
    }
}

module.exports = { sendEmailWithAttachment };

