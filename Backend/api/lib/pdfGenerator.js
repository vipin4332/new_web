// PDF Generator for Admit Card
const PDFDocument = require('pdfkit');

function generateAdmitCardPDF(userData, rollNumber) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50,
                layout: 'portrait'
            });

            const chunks = [];
            
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Header
            doc.fontSize(24)
               .font('Helvetica-Bold')
               .text('TENX REGISTRATION', { align: 'center' });
            
            doc.moveDown(0.5);
            doc.fontSize(18)
               .font('Helvetica-Bold')
               .text('ADMIT CARD', { align: 'center' });
            
            doc.moveDown(1);

            // Border box
            const startY = doc.y;
            doc.rect(50, startY, 495, 600)
               .stroke();

            // Roll Number (Top Right)
            doc.fontSize(12)
               .font('Helvetica-Bold')
               .text(`Roll Number: ${rollNumber}`, 50, startY + 20, {
                   align: 'right',
                   width: 495
               });

            doc.moveDown(2);

            // Personal Information Section
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .text('PERSONAL INFORMATION', 70, doc.y);
            
            doc.moveDown(0.5);
            doc.fontSize(10)
               .font('Helvetica')
               .text(`Name: ${userData.applicant_name || 'N/A'}`, 70, doc.y)
               .text(`Father's Name: ${userData.father_name || 'N/A'}`, 70, doc.y + 15)
               .text(`Date of Birth: ${formatDate(userData.dob_day, userData.dob_month, userData.dob_year)}`, 70, doc.y + 15)
               .text(`Gender: ${userData.gender || 'N/A'}`, 70, doc.y + 15)
               .text(`Mobile: ${userData.mobile || 'N/A'}`, 70, doc.y + 15)
               .text(`WhatsApp: ${userData.whatsapp || 'N/A'}`, 70, doc.y + 15)
               .text(`Email: ${userData.email || 'N/A'}`, 70, doc.y + 15);

            doc.moveDown(1.5);

            // Address Section
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .text('ADDRESS', 70, doc.y);
            
            doc.moveDown(0.5);
            doc.fontSize(10)
               .font('Helvetica')
               .text(`Address: ${userData.address || 'N/A'}`, 70, doc.y, {
                   width: 450,
                   lineGap: 5
               })
               .text(`State: ${userData.state || 'N/A'}`, 70, doc.y + 5);

            doc.moveDown(1.5);

            // Educational Information
            doc.fontSize(14)
               .font('Helvetica-Bold')
               .text('EDUCATIONAL INFORMATION', 70, doc.y);
            
            doc.moveDown(0.5);
            doc.fontSize(10)
               .font('Helvetica')
               .text(`Education: ${userData.education || 'N/A'}`, 70, doc.y)
               .text(`Qualification: ${userData.qualification || 'N/A'}`, 70, doc.y + 15, {
                   width: 450,
                   lineGap: 5
               })
               .text(`Skills: ${userData.skills || 'N/A'}`, 70, doc.y + 15, {
                   width: 450,
                   lineGap: 5
               });

            doc.moveDown(2);

            // Footer
            const footerY = startY + 550;
            doc.fontSize(10)
               .font('Helvetica-Oblique')
               .text('This is a system generated document. No signature required.', 70, footerY, {
                   align: 'center',
                   width: 450
               });

            doc.moveDown(1);
            doc.fontSize(9)
               .font('Helvetica')
               .text(`Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, 70, doc.y, {
                   align: 'center',
                   width: 450
               });

            // Finalize PDF
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

function formatDate(day, month, year) {
    if (!day || !month || !year) return 'N/A';
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return `${day} ${months[parseInt(month) - 1] || month}, ${year}`;
}

module.exports = { generateAdmitCardPDF };

