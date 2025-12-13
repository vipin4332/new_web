// Form submission endpoint with MongoDB, PDF generation, and email
const { connectToDatabase } = require('./lib/mongodb');
const { generateAdmitCardPDF } = require('./lib/pdfGenerator');
const { generateRollNumber } = require('./lib/rollNumberGenerator');
const { sendEmailWithAttachment } = require('./lib/emailService');
const { put } = require('@vercel/blob');

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

        // Only allow POST requests
        if (req.method !== 'POST') {
            return res.status(405).json({ 
                success: false,
                status: 'error',
                error: 'Method not allowed',
                message: 'Only POST requests are allowed'
            });
        }

        console.log('📝 Form submission received at:', new Date().toISOString());
        console.log('📝 Request method:', req.method);
        console.log('📝 Content-Type:', req.headers['content-type']);

        // Parse form data
        // Vercel automatically parses FormData, but we need to handle it properly
        let formData = req.body || {};
        
        // If body is a string, try to parse it
        if (typeof formData === 'string') {
            try {
                formData = JSON.parse(formData);
                console.log('📝 Parsed JSON body');
            } catch (e) {
                console.warn('⚠️ Failed to parse JSON body');
                formData = {};
            }
        }

        // Validate required fields
        const requiredFields = [
            'email', 'applicant_name', 'father_name', 'gender', 
            'mobile', 'whatsapp', 'address', 'state', 
            'education', 'qualification', 'skills',
            'dob_day', 'dob_month', 'dob_year'
        ];

        const missingFields = requiredFields.filter(field => !formData[field]);
        if (missingFields.length > 0) {
            console.error('❌ Missing required fields:', missingFields);
            return res.status(400).json({
                success: false,
                status: 'error',
                message: `Missing required fields: ${missingFields.join(', ')}`
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

        // Validate mobile number (10 digits)
        if (!/^\d{10}$/.test(formData.mobile)) {
            console.error('❌ Invalid mobile number:', formData.mobile);
            return res.status(400).json({
                success: false,
                status: 'error',
                message: 'Mobile number must be 10 digits'
            });
        }

        console.log('✅ Form validation passed');

        // Generate unique roll number
        const rollNumber = generateRollNumber();
        console.log('🔢 Generated roll number:', rollNumber);

        // Prepare data for MongoDB
        const registrationData = {
            rollNumber: rollNumber,
            email: formData.email,
            applicant_name: formData.applicant_name,
            father_name: formData.father_name,
            gender: formData.gender,
            mobile: formData.mobile,
            whatsapp: formData.whatsapp,
            address: formData.address,
            state: formData.state,
            dob_day: formData.dob_day,
            dob_month: formData.dob_month,
            dob_year: formData.dob_year,
            education: formData.education,
            qualification: formData.qualification,
            skills: formData.skills,
            submittedAt: new Date(),
            status: 'registered'
        };

        // Connect to MongoDB and save data
        console.log('💾 Connecting to MongoDB...');
        const { db } = await connectToDatabase();
        const registrationsCollection = db.collection('registrations');

        // Check if email already exists (optional - you can remove this if you want to allow multiple registrations)
        // Uncomment below if you want to prevent duplicate registrations
        /*
        const existingRegistration = await registrationsCollection.findOne({ email: formData.email });
        if (existingRegistration) {
            console.warn('⚠️ Email already registered:', formData.email);
            return res.status(400).json({
                success: false,
                status: 'error',
                message: 'This email is already registered'
            });
        }
        */

        // Insert registration data
        const insertResult = await registrationsCollection.insertOne(registrationData);
        console.log('✅ Data saved to MongoDB:', insertResult.insertedId);

        // Generate Admit Card PDF
        console.log('📄 Generating admit card PDF...');
        const pdfBuffer = await generateAdmitCardPDF(registrationData, rollNumber);
        console.log('✅ PDF generated:', (pdfBuffer.length / 1024).toFixed(2), 'KB');

        // Upload PDF to Vercel Blob Storage
        let pdfUrl = null;
        try {
            const fileName = `admit-cards/${rollNumber}_${Date.now()}.pdf`;
            console.log('☁️ Uploading PDF to Vercel Blob...');
            
            const blob = await put(fileName, pdfBuffer, {
                access: 'public',
                contentType: 'application/pdf',
            });
            
            pdfUrl = blob.url;
            console.log('✅ PDF uploaded to Blob Storage:', pdfUrl);
        } catch (blobError) {
            console.error('⚠️ Blob upload error (continuing without storage):', blobError.message);
            // Continue even if blob upload fails - we can still email the PDF
        }

        // Update MongoDB with PDF URL if available
        if (pdfUrl) {
            await registrationsCollection.updateOne(
                { _id: insertResult.insertedId },
                { $set: { pdfUrl: pdfUrl } }
            );
        }

        // Prepare email content
        const emailSubject = `Your Tenx Registration Admit Card - ${rollNumber}`;
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #007BFF, #0d46ff); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #007BFF; }
                    .roll-number { font-size: 24px; font-weight: bold; color: #007BFF; text-align: center; padding: 15px; background: white; border-radius: 8px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Tenx Registration</h1>
                    </div>
                    <div class="content">
                        <h2>Registration Successful!</h2>
                        <p>Dear ${formData.applicant_name},</p>
                        <p>Thank you for registering with Tenx. Your registration has been successfully processed.</p>
                        
                        <div class="roll-number">
                            Your Roll Number: ${rollNumber}
                        </div>
                        
                        <div class="info-box">
                            <p><strong>Your admit card is attached to this email.</strong></p>
                            <p>Please download and keep it safe. You will need it for further processes.</p>
                        </div>
                        
                        <p>If you have any questions, please contact our support team.</p>
                        
                        <div class="footer">
                            <p>© 2025 Tenx. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Send email with PDF attachment
        console.log('📧 Sending email with admit card...');
        await sendEmailWithAttachment(
            formData.email,
            emailSubject,
            emailHtml,
            pdfBuffer,
            `AdmitCard_${rollNumber}.pdf`
        );
        console.log('✅ Email sent successfully');

        // Update MongoDB with email sent status
        await registrationsCollection.updateOne(
            { _id: insertResult.insertedId },
            { $set: { emailSent: true, emailSentAt: new Date() } }
        );

        // Return success response
        console.log('✅ Registration process completed successfully');
        return res.status(200).json({
            success: true,
            message: 'Admit card sent',
            rollNumber: rollNumber
        });

    } catch (error) {
        console.error('❌ Form submission error:', error);
        console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        return res.status(500).json({
            success: false,
            status: 'error',
            message: 'Failed to submit form. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
