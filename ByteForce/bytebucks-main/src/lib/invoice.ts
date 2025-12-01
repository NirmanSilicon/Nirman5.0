// NEW: src/lib/invoice.ts
import jsPDF from "jspdf";
import "jspdf-autotable";

interface InvoiceDetails {
  orderId: string;
  nftName: string;
  priceUSD: number;
}

// Extend jsPDF with the autoTable plugin
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export const generateInvoicePDF = (details: InvoiceDetails) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  const transactionId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const invoiceId = `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const issueDate = new Date().toLocaleDateString();

  // Header
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 14, 22);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${invoiceId}`, 14, 32);
  doc.text(`Transaction ID: ${transactionId}`, 14, 38);
  doc.text(`Date: ${issueDate}`, 14, 44);

  // Client Info
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 14, 60);
  doc.setFont("helvetica", "normal");
  doc.text("Valued ByteBucks Collector", 14, 66);
  
  // Invoice Table
  doc.autoTable({
    startY: 80,
    head: [["Description", "Quantity", "Unit Price", "Total"]],
    body: [
      [
        details.nftName,
        "1",
        `$${details.priceUSD.toLocaleString()}`,
        `$${details.priceUSD.toLocaleString()}`,
      ],
    ],
    theme: "striped",
    headStyles: { fillColor: [38, 38, 38] },
    foot: [
        [{ content: 'Subtotal', colSpan: 3, styles: { halign: 'right' } }, `$${details.priceUSD.toLocaleString()}`],
        [{ content: 'Tax (0%)', colSpan: 3, styles: { halign: 'right' } }, '$0.00'],
        [{ content: 'Total', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, `$${details.priceUSD.toLocaleString()}`],
    ],
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Thank you for your purchase!", 14, pageHeight - 10);
  
  // Save the PDF
  doc.save(`Invoice_${details.orderId.slice(0, 8)}_${details.nftName.replace(/\s/g, '_')}.pdf`);
};
