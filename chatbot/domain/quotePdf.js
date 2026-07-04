import { profile } from "../domain/config/companyprofile.js";

export function generateQuotePDF(data, logo, photos = []) {

  console.log("photos received:", photos.length)

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

  // ── QUOTE TITLE ─────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("QUOTE", 145, 20);

  const today = new Date().toLocaleDateString("en-GB");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Date: ${today}`, 145, 28);

  // ── RESET ──────────────────────────────────────────────
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  // ── DIVIDER ────────────────────────────────────────────
  doc.line(15, 58, 195, 58);

  // ── QUOTE FOR ──────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("QUOTE FOR", 15, 70);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(String(data.customerName    || ""), 15, 79);
  doc.text(String(data.customerAddress || ""), 15, 87);

  // ── DESCRIPTION ────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("DESCRIPTION OF WORK", 15, 103);

  doc.rect(15, 108, 180, 28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const descLines = doc.splitTextToSize(String(data.description || ""), 170);
  doc.text(descLines, 20, 118);

  // ── AMOUNT ─────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("QUOTED PRICE", 15, 152);

  doc.setFontSize(20);
  doc.text(`£${String(data.amount || "")}`, 15, 163);

  // ── VALID UNTIL ──────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Valid Until: ${String(data.validUntil || "")}`, 15, 174);

  // ── TERMS BOX ────────────────────────────────────────────
  doc.setFillColor(245, 245, 245);
  doc.rect(15, 185, 180, 40, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(84, 192, 194);
  doc.text("TERMS", 20, 195);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const termsLines = doc.splitTextToSize(
    "This quote is an estimate based on the information provided and is not a fixed invoice. " +
    "Prices may be subject to change if the scope of work differs on inspection. " +
    "Acceptance of this quote confirms agreement to proceed at the price stated above.",
    170
  );
  doc.text(termsLines, 20, 203);

  // ── FOOTER BAR ─────────────────────────────────────────
  doc.setFillColor(84, 192, 194);
  doc.rect(0, 282, 210, 15, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(
    `Thank you for considering us  •  ${data.website || profile.website || ""}`,
    105, 290, { align: "center" }
  );

  if (photos.length) {
    doc.addPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("SITE PHOTOS", 15, 20);

    const imgWidth = 85;
    const imgHeight = 65;
    const gap = 10;
    let x = 15;
    let y = 30;

    photos.forEach((photo, i) => {
       if (x + imgWidth > 195) {
    x = 15;
    y += imgHeight + gap;
  }
  if (y + imgHeight > 280) {
    doc.addPage();
    x = 15;
    y = 20;
  }
  const format = photo.startsWith("data:image/png") ? "PNG" : "JPEG";
  doc.addImage(photo, format, x, y, imgWidth, imgHeight);
  x += imgWidth + gap;
    });
}

 // ── SAVE ───────────────────────────────────────────────
  doc.save(`Quote_${data.customerName || "client"}.pdf`);
}