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

            // Admit Card Information Section (Simplified)
            doc.fontSize(16)
               .font('Helvetica-Bold')
               .text('ADMIT CARD INFORMATION', 70, doc.y, { align: 'center', width: 450 });
            
            doc.moveDown(1.5);
            
            // Information fields with better spacing
            const lineHeight = 25;
            let currentY = doc.y;
            
            doc.fontSize(12)
               .font('Helvetica-Bold')
               .text('Applicant Name:', 70, currentY);
            doc.font('Helvetica')
               .text(userData.applicant_name || 'N/A', 220, currentY);
            
            currentY += lineHeight;
            doc.font('Helvetica-Bold')
               .text('Father\'s Name:', 70, currentY);
            doc.font('Helvetica')
               .text(userData.father_name || 'N/A', 220, currentY);
            
            currentY += lineHeight;
            doc.font('Helvetica-Bold')
               .text('Contact No.:', 70, currentY);
            doc.font('Helvetica')
               .text(userData.mobile || 'N/A', 220, currentY);
            
            currentY += lineHeight;
            doc.font('Helvetica-Bold')
               .text('Roll Number:', 70, currentY);
            doc.font('Helvetica')
               .fontSize(14)
               .text(rollNumber, 220, currentY);
            
            currentY += lineHeight;
            doc.fontSize(12)
               .font('Helvetica-Bold')
               .text('Email:', 70, currentY);
            doc.font('Helvetica')
               .text(userData.email || 'N/A', 220, currentY);
            
            doc.y = currentY + lineHeight;

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

module.exports = { generateAdmitCardPDF };

