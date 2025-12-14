// Test endpoint to verify PDF generation and email attachment
const { generateAdmitCardPDF } = require('./lib/pdfGenerator');
const { generateRollNumber } = require('./lib/rollNumberGenerator');
const { sendEmailWithAttachment } = require('./lib/emailService');

module.exports = async (req, res) => {
    try {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Handle OPTIONS request
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        if (req.method !== 'POST') {
            return res.status(405).json({ 
                success: false,
                error: 'Method not allowed',
                message: 'Only POST requests are allowed'
            });
        }

        const { testEmail } = req.body || {};

        if (!testEmail) {
            return res.status(400).json({
                success: false,
                error: 'Missing testEmail in request body'
            });
        }

        console.log('🧪 Testing PDF generation and email attachment...');
        console.log('📧 Test email:', testEmail);

        // Generate test data
        const rollNumber = generateRollNumber();
        const testData = {
            applicant_name: 'Test User',
            father_name: 'Test Father',
            mobile: '1234567890',
            email: testEmail,
            rollNumber: rollNumber
        };

        // Generate PDF
        console.log('📄 Generating test PDF...');
        const pdfBuffer = await generateAdmitCardPDF(testData, rollNumber);
        console.log('✅ PDF generated:', (pdfBuffer.length / 1024).toFixed(2), 'KB');

        // Send email with attachment
        const emailSubject = `Test Admit Card - ${rollNumber}`;
        const emailHtml = `
            <h2>Test Email with PDF Attachment</h2>
            <p>This is a test email to verify PDF attachment functionality.</p>
            <p><strong>Roll Number:</strong> ${rollNumber}</p>
            <p>If you can see the PDF attached, the system is working correctly!</p>
        `;

        console.log('📧 Sending test email with PDF attachment...');
        await sendEmailWithAttachment(
            testEmail,
            emailSubject,
            emailHtml,
            pdfBuffer,
            `TestAdmitCard_${rollNumber}.pdf`
        );

        return res.status(200).json({
            success: true,
            message: 'Test email sent successfully with PDF attachment',
            rollNumber: rollNumber,
            pdfSize: `${(pdfBuffer.length / 1024).toFixed(2)} KB`
        });

    } catch (error) {
        console.error('❌ Test error:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

