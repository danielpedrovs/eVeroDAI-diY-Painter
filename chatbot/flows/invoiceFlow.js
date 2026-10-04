import { session } from "../core/session.js";
import { responses } from "../data/responses.js";
import { generateInvoicePDF } from "../domain/invoicePdf.js";
import { getUploadedLogo } from "../core/logoStore.js";
import { profile } from "../domain/config/companyprofile.js";

// ── SETTINGS ─────────────────────────────────────────────
const PASSWORD = "Londonamzl"; // paste your existing password here (lowercase)
const MAX_ATTEMPTS = 3;

// Fields the user can change from the summary screen
const EDIT_FIELDS = {
  "1": { key: "companyName",     label: "business name" },
  "2": { key: "customerName",    label: "customer name" },
  "3": { key: "customerAddress", label: "customer address" },
  "4": { key: "description",     label: "work description" },
  "5": { key: "amount",          label: "amount (e.g. 450 or 450.50)" },
  "6": { key: "dueDate",         label: "due date" },
};

const EDIT_MENU =
  "What would you like to change?\n\n" +
  "1. Business name\n" +
  "2. Customer name\n" +
  "3. Customer address\n" +
  "4. Work description\n" +
  "5. Amount\n" +
  "6. Due date\n" +
  "7. Logo\n\n" +
  "Type a number, or BACK to return to the summary.";

// ── HELPERS ──────────────────────────────────────────────
function parseAmount(text) {
  const n = parseFloat(text.replace(/[£,\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? n.toFixed(2) : null;
}

function formatName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}

function buildSummary() {
  const d = session.invoiceData;
  return (
    `Invoice Summary\n\n` +
    `Business: ${d.companyName}\n` +
    `Customer: ${d.customerName}\n` +
    `Address:  ${d.customerAddress}\n` +
    `Work:     ${d.description}\n` +
    `Amount:   £${d.amount}\n` +
    `Due Date: ${d.dueDate}\n` +
    `Logo:     ${getUploadedLogo() ? "Uploaded" : "Not included"}\n\n` +
    `Type YES to continue, EDIT to change something, or CANCEL to stop.`
  );
}

function resetFlow() {
  window.hideLogoUploader();
  session.activeFlow = null;
  session.invoiceStep = 0;
  session.invoiceData = {};
  session.attempts = 0;
  session.editField = null;
}

function finishInvoice() {
  generateInvoicePDF(session.invoiceData, getUploadedLogo());
  resetFlow();
  return "Invoice generated and downloaded ✅ Type 'create invoice' to make another.";
}

// ── MAIN FLOW ────────────────────────────────────────────
export function handleInvoiceFlow(message) {
  const msg = message.trim().toLowerCase();

  // Works on every step
  if (msg === "cancel") {
    resetFlow();
    return "Invoice cancelled. Type 'create invoice' to start again.";
  }

  switch (session.invoiceStep) {

    // ── STEP 2 — BUSINESS DETAILS RESPONSE ────────────────
    case 2:
      if (msg === "yes") {
        session.attempts = 0;
        session.invoiceStep = 30;
        return "Enter your business password:";
      }
      if (msg === "no") {
        session.invoiceStep = 21;
        return "Enter your business name:";
      }
      return "Please type YES or NO.";

    // ── STEP 30 — PASSWORD CHECK (business details) ───────
    case 30:
      if (msg === "manual") {
        session.attempts = 0;
        session.invoiceStep = 21;
        return "Enter your business name:";
      }
      if (msg === PASSWORD.toLowerCase()) {
        session.attempts = 0;
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
        return askForNextMissingField();
      }
      session.attempts = (session.attempts || 0) + 1;
      if (session.attempts >= MAX_ATTEMPTS) {
        return "Incorrect password. Type MANUAL to enter your details yourself, or CANCEL to stop.";
      }
      return `Incorrect password (${session.attempts}/${MAX_ATTEMPTS}). Try again, or type MANUAL to enter your details yourself.`;

    // ── STEP 21 — CUSTOM BUSINESS NAME ────────────────────
    case 21:
      session.invoiceData.companyName = message.trim();
      session.invoiceStep = 22;
      return "Enter your business address:";

    // ── STEP 22 — CUSTOM BUSINESS ADDRESS ─────────────────
    case 22:
      session.invoiceData.companyAddress = message.trim();
      session.invoiceStep = 23;
      return "Enter your phone number:";

    // ── STEP 23 — CUSTOM PHONE ────────────────────────────
    case 23:
      session.invoiceData.phone = message.trim();
      session.invoiceStep = 24;
      return "Enter your email:";

    // ── STEP 24 — CUSTOM EMAIL ────────────────────────────
    case 24:
      session.invoiceData.email = message.trim();
      session.invoiceStep = 25;
      return "Enter your website (or type SKIP):";

    // ── STEP 25 — CUSTOM WEBSITE ──────────────────────────
    case 25:
      session.invoiceData.website = msg === "skip" ? "" : message.trim();
      session.invoiceStep = 4;
      return "What is the customer's name?";

    // ── STEP 4 — CUSTOMER NAME ────────────────────────────
    case 4:
  if (!session.invoiceData.customerName) {
    session.invoiceData.customerName = formatName(message);
  }


  return askForNextMissingField();
  

    // ── STEP 5 — CUSTOMER ADDRESS ─────────────────────────
  case 5:
  if (!session.invoiceData.customerAddress) {
    session.invoiceData.customerAddress = message.trim();
  }

  return askForNextMissingField();

    // ── STEP 6 — WORK DESCRIPTION ─────────────────────────
   case 6:
  if (!session.invoiceData.description) {
    session.invoiceData.description = message.trim();
  }

  return askForNextMissingField();

    // ── STEP 7 — AMOUNT (validated) ───────────────────────
 case 7: {
  if (session.invoiceData.amount) {
    return askForNextMissingField();
  }

  const amount = parseAmount(message);

  if (!amount) {
    return "Please enter a valid amount, e.g. 450 or 450.50";
  }

  session.invoiceData.amount = amount;

  return askForNextMissingField();
}

    // ── STEP 8 — DUE DATE ─────────────────────────────────
 case 8:
  if (!session.invoiceData.dueDate) {
    session.invoiceData.dueDate = message.trim();
  }

  session.invoiceStep = 9;
  return "Would you like to upload a company logo? (YES/NO)";

        // ── STEP 9 — Logo Question ────────────────────────────
    case 9:
      if (msg === "yes") {
        window.showLogoUploader();
        session.invoiceStep = 10;
        return "Please select your logo and then type CONTINUE.";
      }
        if( msg === "no"){
          session.invoiceStep = 12;
          return buildSummary();
        }

        return "Please answer Yes or No.";


    // ── STEP 10 — LOGO QUESTION ────────────────────────────
    case 10:
      if (msg === "continue") {
        session.invoiceStep = 12;

        return buildSummary();
      }
      return "after uploading the logo, type CONTINUE.";


    // ── STEP 12 — SUMMARY: YES / EDIT ─────────────────────
    case 12:

  if (msg === "yes") {
    session.invoiceStep = 13;

    return (
      "Use default payment details?\n\n" +
      "Type YES to use these or NO to enter new ones."
    );
  }

  if (msg === "edit") {
    session.invoiceStep = 41;

    return EDIT_MENU;
  }

  return buildSummary();

    // ── STEP 41 — EDIT MENU ───────────────────────────────
    case 41: {
      if (msg === "back") {
        session.invoiceStep = 12;
        return buildSummary();
      }
      if (msg === "7") {
        window.showLogoUploader();
        session.invoiceStep = 10; // CONTINUE returns to the summary
        return "Select your new logo, then type CONTINUE.";
      }
      const field = EDIT_FIELDS[msg];
      if (!field) return "Please type a number from 1 to 7, or BACK.";
      session.editField = field;
      session.invoiceStep = 42;
      return `Enter the new ${field.label}:`;
    }

    // ── STEP 42 — APPLY EDIT, RETURN TO SUMMARY ───────────
    case 42: {
      const field = session.editField;
      if (!field) {
        session.invoiceStep = 12;
        return buildSummary();
      }
      let value = message.trim();
      if (field.key === "amount") {
        value = parseAmount(value);
        if (!value) return "Please enter a valid amount, e.g. 450 or 450.50";
      }
      session.invoiceData[field.key] = value;
      session.editField = null;
      session.invoiceStep = 12;
      return `Updated ✅\n\n${buildSummary()}`;
    }

    // ── STEP 13 — PAYMENT DETAILS CHOICE ──────────────────
    case 13:
      if (msg === "yes") {
        session.attempts = 0;
        session.invoiceStep = 31;
        return "Enter your payment password:";
      }
      if (msg === "no") {
        session.invoiceStep = 14;
        return "Enter the account holder name:";
      }
      return "Please type YES or NO.";

    // ── STEP 31 — PAYMENT PASSWORD CHECK ──────────────────
    case 31:
      if (msg === "manual") {
        session.attempts = 0;
        session.invoiceStep = 14;
        return "Enter the account holder name:";
      }
      if (msg === PASSWORD.toLowerCase()) {
        session.invoiceData.paymentName    = profile.paymentName;
        session.invoiceData.paymentBank    = profile.paymentBank;
        session.invoiceData.paymentAccount = profile.paymentAccount;
        session.invoiceData.paymentSort    = profile.paymentSort;
        return finishInvoice();
      }
      session.attempts = (session.attempts || 0) + 1;
      if (session.attempts >= MAX_ATTEMPTS) {
        return "Incorrect password. Type MANUAL to enter the payment details yourself, or CANCEL to stop.";
      }
      return `Incorrect password (${session.attempts}/${MAX_ATTEMPTS}). Try again, or type MANUAL to enter the payment details yourself.`;

    // ── STEP 13 — CUSTOM PAYMENT NAME ─────────────────────
    case 14:
      session.invoiceData.paymentName = message.trim();
      session.invoiceStep = 15;
      return "Enter the bank name:";

    // ── STEP 14 — CUSTOM PAYMENT BANK ─────────────────────
    case 15:
      session.invoiceData.paymentBank = message.trim();
      session.invoiceStep = 16;
      return "Enter the account number:";

    // ── STEP 15 — CUSTOM ACCOUNT NUMBER ───────────────────
    case 16:
      session.invoiceData.paymentAccount = message.trim();
      session.invoiceStep = 17;
      return "Enter the sort code:";

    // ── STEP 16 — CUSTOM SORT CODE + GENERATE ─────────────
    case 17:
      session.invoiceData.paymentSort = message.trim();
      return finishInvoice();
  }

  return "Something went wrong. Please type 'create invoice' to start again.";
}


function getMissingInvoiceField() {
  const d = session.invoiceData;

  if (!d.customerName) return "customerName";
  if (!d.customerAddress) return "customerAddress";
  if (!d.description) return "description";
  if (!d.amount) return "amount";
  if (!d.dueDate) return "dueDate";

  return null;
}

function askForNextMissingField() {

  const missing = getMissingInvoiceField();

  switch (missing) {

    case "customerName":
      session.invoiceStep = 4;
      return "What is the customer's name?";

    case "customerAddress":
      session.invoiceStep = 5;
      return "What is the customer's address?";

    case "description":
      session.invoiceStep = 6;
      return "What work was carried out?";

    case "amount":
      session.invoiceStep = 7;
      return "What is the invoice amount?";

    case "dueDate":
      session.invoiceStep = 8;
      return "What is the invoice due date?";

    default:
      session.invoiceStep = 9;
            return "Would you like to upload a company logo? (YES/NO)";
  }
}