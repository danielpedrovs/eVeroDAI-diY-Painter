import { profile } from "../domain/config/companyprofile.js";

export function generateInvoicePDF(data, logo) {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // ── HEADER BACKGROUND ──────────────────────────────────
  doc.setFillColor(84, 192, 194);
  doc.rect(0, 0, 210, 50, "F");

  // ── LOGO ───────────────────────────────────────────────
  if (logo) {
    doc.addImage(logo, "PNG", 12, 8, 25, 25);
  }

  // ── COMPANY TEXT ───────────────────────────────────────
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(String(data.companyName    || profile.companyName    || ""), 42, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(String(data.companyAddress || profile.companyAddress || ""), 42, 23);
  doc.text(String(data.phone          || profile.phone          || ""), 42, 29);
  doc.text(String(data.email          || profile.email          || ""), 42, 35);
  doc.text(String(data.website        || profile.website        || ""), 42, 41);

  // ── INVOICE TITLE ──────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("INVOICE", 145, 20);

  const today = new Date().toLocaleDateString("en-GB");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Date: ${today}`, 145, 28);

  // ── RESET ──────────────────────────────────────────────
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  // ── DIVIDER ────────────────────────────────────────────
  doc.line(15, 58, 195, 58);

  // ── BILL TO ────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("BILL TO", 15, 70);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(String(data.customerName    || ""), 15, 79);
  doc.text(String(data.customerAddress || ""), 15, 87);

  // ── DESCRIPTION ────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("DESCRIPTION", 15, 103);

  doc.rect(15, 108, 180, 28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const descLines = doc.splitTextToSize(String(data.description || ""), 170);
  doc.text(descLines, 20, 118);

  // ── AMOUNT ─────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("AMOUNT DUE", 15, 152);

  doc.setFontSize(20);
  doc.text(`£${String(data.amount || "")}`, 15, 163);

  // ── DUE DATE ───────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Due Date: ${String(data.dueDate || "")}`, 15, 174);

  // ── PAYMENT DETAILS BOX ────────────────────────────────
  doc.setFillColor(245, 245, 245);
  doc.rect(15, 185, 180, 40, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(84, 192, 194);
  doc.text("PAYMENT DETAILS", 20, 195);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Account Name:  ${String(data.paymentName    || "")}`, 20, 204);
  doc.text(`Bank:          ${String(data.paymentBank    || "")}`, 20, 211);
  doc.text(`Account No:    ${String(data.paymentAccount || "")}`, 20, 218);
  doc.text(`Sort Code:     ${String(data.paymentSort    || "")}`, 20, 225);

  // ── FOOTER BAR ─────────────────────────────────────────
  doc.setFillColor(84, 192, 194);
  doc.rect(0, 282, 210, 15, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(
    `Thank you for your business  •  ${data.website || profile.website || ""}`,
    105, 290, { align: "center" }
  );

  // ── SAVE ───────────────────────────────────────────────
  doc.save(`Invoice_${data.customerName || "client"}.pdf`);
}