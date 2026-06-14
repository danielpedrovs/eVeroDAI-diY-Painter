import { session } from "../core/session.js";
import { responses } from "../data/responses.js";
import { generateInvoicePDF } from "../domain/invoicePdf.js";
import { getUploadedLogo } from "../core/logoStore.js";
import { profile } from "../domain/config/companyprofile.js";

export function handleInvoiceFlow(message) {

  switch (session.invoiceStep) {

    // ── STEP 2 — BUSINESS DETAILS RESPONSE ────────────────
    case 2:
  if (message.toLowerCase() === "yes") {
    session.invoiceStep = 30; // go to password check
    return "Enter your business password:";
  }
  if (message.toLowerCase() === "no") {
    session.invoiceStep = 21;
    return "Enter your business name:";
  }
  return "Please type YES or NO.";

  // ── STEP 30 — PASSWORD CHECK ───────────────────────────
case 30:
  if (message.toLowerCase() === "londonamzl") { // ← replace with your password
    session.invoiceData.companyName    = profile.companyName;
    session.invoiceData.companyAddress = profile.companyAddress;
    session.invoiceData.phone          = profile.phone;
    session.invoiceData.email          = profile.email;
    session.invoiceData.website        = profile.website;
    session.invoiceData.paymentName    = profile.paymentName;
    session.invoiceData.paymentBank    = profile.paymentBank;
    session.invoiceData.paymentAccount = profile.paymentAccount;
    session.invoiceData.paymentSort    = profile.paymentSort;
    session.invoiceStep = 4;
    return "What is the customer's name?";
  }
  // wrong password — treat as custom entry instead
  session.invoiceStep = 21;
  return "Incorrect password. Please enter your business name manually:";

    // ── STEP 21 — CUSTOM BUSINESS NAME ────────────────────
    case 21:
      session.invoiceData.companyName = message;
      session.invoiceStep = 22;
      return "Enter your business address:";

    // ── STEP 22 — CUSTOM BUSINESS ADDRESS ─────────────────
    case 22:
      session.invoiceData.companyAddress = message;
      session.invoiceStep = 23;
      return "Enter your phone number:";

    // ── STEP 23 — CUSTOM PHONE ─────────────────────────────
    case 23:
      session.invoiceData.phone = message;
      session.invoiceStep = 24;
      return "Enter your email:";

// ── STEP 24 — CUSTOM EMAIL ─────────────────────────────
case 24:
  session.invoiceData.email = message;
  session.invoiceStep = 25;
  return "Enter your website (or type SKIP):";

// ── STEP 25 — CUSTOM WEBSITE ───────────────────────────
case 25:
  session.invoiceData.website = message.toLowerCase() === "skip" ? "" : message;
  session.invoiceStep = 4;
  return "What is the customer's name?";

    // ── STEP 4 — CUSTOMER NAME ─────────────────────────────
    case 4:
      session.invoiceData.customerName = message;
      session.invoiceStep = 5;
      return responses.invoiceCustomerAddress;

    // ── STEP 5 — CUSTOMER ADDRESS ──────────────────────────
    case 5:
      session.invoiceData.customerAddress = message;
      session.invoiceStep = 6;
      return responses.invoiceDescription;

    // ── STEP 6 — WORK DESCRIPTION ──────────────────────────
    case 6:
      session.invoiceData.description = message;
      session.invoiceStep = 7;
      return responses.invoiceAmount;

    // ── STEP 7 — AMOUNT ────────────────────────────────────
    case 7:
      session.invoiceData.amount = message;
      session.invoiceStep = 8;
      return responses.invoiceDueDate;

    // ── STEP 8 — DUE DATE ──────────────────────────────────
    case 8:
      session.invoiceData.dueDate = message;
      session.invoiceStep = 9;
      return "Would you like to upload a company logo? (YES/NO)";

    // ── STEP 9 — LOGO QUESTION ─────────────────────────────
    case 9:
      if (message.toLowerCase() === "yes") {
        window.showLogoUploader();
        session.invoiceStep = 10;
        return "Please select your logo and then type CONTINUE.";
      }
      if (message.toLowerCase() === "no") {
        session.invoiceStep = 11;
        return `Invoice Summary\n\nBusiness: ${session.invoiceData.companyName}\nCustomer: ${session.invoiceData.customerName}\nAddress:  ${session.invoiceData.customerAddress}\nWork:     ${session.invoiceData.description}\nAmount:   £${session.invoiceData.amount}\nDue Date: ${session.invoiceData.dueDate}\nLogo:     Not included\n\n${responses.invoiceConfirm}`;
      }
      return "Please answer YES or NO.";

    // ── STEP 10 — WAITING FOR LOGO ─────────────────────────
    case 10:
      if (message.toLowerCase() === "continue") {
        session.invoiceStep = 11;
        return `Invoice Summary\n\nBusiness: ${session.invoiceData.companyName}\nCustomer: ${session.invoiceData.customerName}\nAddress:  ${session.invoiceData.customerAddress}\nWork:     ${session.invoiceData.description}\nAmount:   £${session.invoiceData.amount}\nDue Date: ${session.invoiceData.dueDate}\nLogo:     Uploaded\n\n${responses.invoiceConfirm}`;
      }
      return "After uploading the logo, type CONTINUE.";

    // ── STEP 11 — CONFIRM INVOICE ──────────────────────────
case 11:
  if (message.toLowerCase() === "yes") {
    session.invoiceStep = 12;
    return `Use default payment details?\n\nType YES to use these or NO to enter new ones.`;
  }
  return responses.invoiceConfirm;

// ── STEP 12 — PAYMENT DETAILS CHOICE ──────────────────
case 12:
  if (message.toLowerCase() === "yes") {
    session.invoiceStep = 31; // go to password check
    return "Enter your payment password:";
  }
  if (message.toLowerCase() === "no") {
    session.invoiceStep = 13;
    return "Enter the account holder name:";
  }
  return "Please type YES or NO.";

// ── STEP 31 — PAYMENT PASSWORD CHECK ──────────────────
case 31:
  if (message.toLowerCase() === "londonamzl") { // ← your password
    session.invoiceData.paymentName    = profile.paymentName;
    session.invoiceData.paymentBank    = profile.paymentBank;
    session.invoiceData.paymentAccount = profile.paymentAccount;
    session.invoiceData.paymentSort    = profile.paymentSort;

    generateInvoicePDF(session.invoiceData, getUploadedLogo());
    window.hideLogoUploader();
    session.activeFlow = null;
    session.invoiceStep = 0;
    session.invoiceData = {};
    return "Invoice generated and downloaded ✅ Type 'create invoice' to make another.";
  }
  // wrong password — fall into manual entry
  session.invoiceStep = 13;
  return "Incorrect password. Please enter your account holder name manually:";

    // ── STEP 13 — CUSTOM PAYMENT NAME ─────────────────────
    case 13:
      session.invoiceData.paymentName = message;
      session.invoiceStep = 14;
      return "Enter the bank name:";

    // ── STEP 14 — CUSTOM PAYMENT BANK ─────────────────────
    case 14:
      session.invoiceData.paymentBank = message;
      session.invoiceStep = 15;
      return "Enter the account number:";

    // ── STEP 15 — CUSTOM ACCOUNT NUMBER ───────────────────
    case 15:
      session.invoiceData.paymentAccount = message;
      session.invoiceStep = 16;
      return "Enter the sort code:";

    // ── STEP 16 — CUSTOM SORT CODE + GENERATE ─────────────
    case 16:
      session.invoiceData.paymentSort = message;

      generateInvoicePDF(session.invoiceData, getUploadedLogo());
      window.hideLogoUploader();
      session.activeFlow = null;
      session.invoiceStep = 0;
      session.invoiceData = {};
      return "Invoice generated and downloaded ✅ Type 'create invoice' to make another.";
  }

  return "Something went wrong. Please type 'create invoice' to start again.";
}