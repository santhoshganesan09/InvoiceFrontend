import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../assets/company logo.jpg';

const getImageFormat = (src) => {
  if (src.startsWith('data:image/')) {
    const match = src.match(/^data:image\/([a-zA-Z]+);base64,/);
    return match ? match[1].toUpperCase() : 'PNG';
  }
  const ext = src.split('.').pop().toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg': return 'JPEG';
    case 'png': return 'PNG';
    case 'webp': return 'WEBP';
    case 'svg': return 'SVG';
    default: return 'PNG';
  }
};

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image failed to load: ' + src));
    img.src = src;
  });
};

export const generatePDF = async ({
  services,
  paymentMethod,
  authorizedPerson,
  date,
  subtotal,
  gst,
  total,
  invoiceNo,
  clientCompany,
  clientAddress,
  district,
  country,
  clientEmail,
  clientContact,
  paid,
  balance,
}) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  try {
    const logoImage = await loadImage(logo);
    const imageType = getImageFormat(logo);

    const logoWidth = 60;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(logoImage, imageType, logoX, 30, logoWidth, 60);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`No. ${invoiceNo.split('-')[1]}`, 40, 110);
    doc.text(
      `DATE: ${new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).toUpperCase()}`,
      40,
      135
    );

    doc.setFontSize(34);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 125, 96);
    doc.text('INVOICE', pageWidth - 40, 125, { align: 'right' });

    doc.setDrawColor(180);
    doc.setLineWidth(0.5);
    doc.line(40, 150, pageWidth - 40, 150);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('INVOICE TO', 40, 170);
    doc.text('COMPANY', pageWidth / 2, 170);

    doc.setFont('helvetica', 'normal');
    let y = 195;
    const lineGap = 20;

    doc.text(clientCompany, 40, y);
    doc.text(clientAddress, 40, y + lineGap);
    doc.text(`${district}, ${country}`, 40, y + 2 * lineGap);
    doc.text(`Contact: ${clientContact || '—'}`, 40, y + 3 * lineGap);
    doc.text(`Email: ${clientEmail || '—'}`, 40, y + 4 * lineGap);

    doc.text('Balasabari Software Developer', pageWidth / 2, y);
    doc.text('No. 78, 1st Street, Kumaran Colony,', pageWidth / 2, y + lineGap);
    doc.text('Vadapalani, Chennai - 600026', pageWidth / 2, y + 2 * lineGap);
    doc.text('Tamil Nadu, India', pageWidth / 2, y + 3 * lineGap);
    doc.text('Contact: 7397260093', pageWidth / 2, y + 4 * lineGap);
    doc.text('balasabarisoftwaredeveloper@gmail.com', pageWidth / 2, y + 5 * lineGap);
    doc.text('https://balasabarisoftwaredeveloper.org/', pageWidth / 2, y + 6 * lineGap);

    const tableY = y + 160;
    const tableData = services.map(s => [
      s.name,
      s.price > 0 ? `Rs. ${parseFloat(s.price).toFixed(2)}/-` : 'Rs. 0'
    ]);

    doc.autoTable({
      startY: tableY,
      head: [['Description', 'Price']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [26, 125, 96],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'left',
        fontSize: 14
      },
      styles: {
        fontSize: 13,
        cellPadding: 6,
        halign: 'left',
      },
      columnStyles: {
        1: { halign: 'right' }
      }
    });

    // === Summary Table ===
    const summaryTableY = doc.lastAutoTable.finalY + 30;
    const summaryBody = [
      ['Subtotal:', `Rs. ${subtotal.toFixed(2)}`],
      ['Tax (18%):', `Rs. ${gst.toFixed(2)}`],
      ['TOTAL:', `Rs. ${total.toFixed(2)}`],
      ['Paid:', `Rs. ${paid.toFixed(2)}`],
      ['Balance:', `Rs. ${balance.toFixed(2)}`],
    ];

    doc.autoTable({
      startY: summaryTableY,
      body: summaryBody,
      theme: 'grid',
      styles: {
        fontSize: 12,
        font: 'helvetica',
        fontStyle: 'normal',
        cellPadding: 8,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'right' }
      },
      tableWidth: 250,
      margin: { left: pageWidth - 290 }
    });

    // === Payment Info ===
    const paymentY = doc.lastAutoTable.finalY + 30;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('PAYMENT METHOD', 40, paymentY);
    doc.setFont('helvetica', 'bold');
    doc.text(`Gpay: ${paymentMethod}`, 40, paymentY + 20);

    // === Notes ===
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Payment Terms Are Usually Stated on the Invoice. The Buyer Could Have Already Paid for the Products or Services Listed on the Invoice.',
      40,
      paymentY + 45,
      { maxWidth: pageWidth - 80 }
    );

    // === Footer Signature ===
    const footerY = paymentY + 80;
    doc.setDrawColor(0);
    doc.line(40, footerY, 200, footerY);
    doc.text('Signature of Authorized Person', 40, footerY + 15);

    doc.line(pageWidth - 160, footerY, pageWidth - 40, footerY);
    doc.text('Date', pageWidth - 120, footerY + 15);

    // === Save PDF ===
    doc.save(`Invoice-${invoiceNo}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error loading logo image. Check path or format.');
  }
};
