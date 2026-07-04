import { session } from "../core/session.js";
import { generateQuotePDF } from "../domain/quotePdf.js";
import { getUploadedLogo } from "../core/logoStore.js";
import { profile } from "../domain/config/companyprofile.js";
import { getJobPhotos, clearJobPhotos } from "../core/jobPhotoStore.js";

function advanceAfterBusinessDetails() {
  if (!session.quoteData.customerName) {
    session.quoteStep = 4;
    return "What is the customer's name?";
  }
  if (!session.quoteData.customerAddress) {
    session.quoteStep = 5;
    return "What is the customer's address?";
  }
   session.quoteStep = 6;
  return session.quoteData.description
    ? advanceAfterDescription()
    : "What work is this quote for?";
}

function advanceAfterDescription() {
  if (session.quoteData.amount) {
    session.quoteStep = 8;
    return "How long is this quote valid for? (e.g. 30 days, or a date)";
  }
  session.quoteStep = 7;
  return "What is the quote amount?";
}

function buildQuoteSummary(logoStatus, photoStatus) {
  const d = session.quoteData;
  return `Quote Summary\n\nBusiness: ${d.companyName}\nCustomer: ${d.customerName}\nAddress:  ${d.customerAddress}\nWork:     ${d.description}\nAmount:   £${d.amount}\nValid Until: ${d.validUntil}\nLogo:     ${logoStatus}\nPhotos:   ${photoStatus}\n\nType YES to confirm and generate the quote.`;
}

export function handleQuoteFlow(message) {

  switch (session.quoteStep) {

    // ── STEP 2 — BUSINESS DETAILS RESPONSE ────────────────
    case 2:
      if (message.toLowerCase() === "yes") {
        session.quoteStep = 30;
        return "Enter your business password:";
      }
      if (message.toLowerCase() === "no") {
        session.quoteStep = 21;
        return "Enter your business name:";
      }
      return "Please type YES or NO.";

    // ── STEP 30 — PASSWORD CHECK ───────────────────────────
    case 30:
      if (message.toLowerCase() === "londonamzl") {
        session.quoteData.companyName    = profile.companyName;
        session.quoteData.companyAddress = profile.companyAddress;
        session.quoteData.phone          = profile.phone;
        session.quoteData.email          = profile.email;
        session.quoteData.website        = profile.website;
        return advanceAfterBusinessDetails();
      }
      session.quoteStep = 21;
      return "Incorrect password. Please enter your business name manually:";

    // ── STEP 21–25 — CUSTOM BUSINESS DETAILS ───────────────
    case 21:
      session.quoteData.companyName = message;
      session.quoteStep = 22;
      return "Enter your business address:";

    case 22:
      session.quoteData.companyAddress = message;
      session.quoteStep = 23;
      return "Enter your phone number:";

    case 23:
      session.quoteData.phone = message;
      session.quoteStep = 24;
      return "Enter your email:";

    case 24:
      session.quoteData.email = message;
      session.quoteStep = 25;
      return "Enter your website (or type SKIP):";

    case 25:
      session.quoteData.website = message.toLowerCase() === "skip" ? "" : message;
      return advanceAfterBusinessDetails();

    // ── STEP 4 — CUSTOMER NAME ─────────────────────────────
    case 4:
      session.quoteData.customerName = message;
      if (session.quoteData.customerAddress) {
        session.quoteStep = 6;
        return session.quoteData.description
          ? advanceAfterDescription()
          : "What work is this quote for?";
      }
      session.quoteStep = 5;
      return "What is the customer's address?";

    // ── STEP 5 — CUSTOMER ADDRESS ──────────────────────────
    case 5:
      session.quoteData.customerAddress = message;
      session.quoteStep = 6;
      return session.quoteData.description
        ? advanceAfterDescription()
        : "What work is this quote for?";

    // ── STEP 6 — JOB DESCRIPTION ────────────────────────────
    case 6:
      session.quoteData.description = message;
      session.quoteStep = 7;
      return session.quoteData.amount
        ? advanceAfterDescription()
        : "What is the quote amount?";

    // ── STEP 7 — AMOUNT ─────────────────────────────────────
    case 7:
      session.quoteData.amount = message;
      session.quoteStep = 8;
      return "How long is this quote valid for? (e.g. 30 days, or a date)";

    // ── STEP 8 — VALID UNTIL ─────────────────────────────────
    case 8:
      session.quoteData.validUntil = message;
      session.quoteStep = 9;
      return "Would you like to upload a company logo? (YES/NO)";

     // ── STEP 9 — LOGO QUESTION ────────────────────────────
    case 9:
      if (message.toLowerCase() === "yes") {
        window.showLogoUploader();
        session.quoteStep = 10;
        return "Please select your logo and then type CONTINUE.";
      }
      if (message.toLowerCase() === "no") {
        session.quoteStep = 90;
        return "Would you like to add photos of the job site? (YES/NO)";
      }
      return "Please answer YES or NO.";

    // ── STEP 10 — WAITING FOR LOGO ─────────────────────────
    case 10:
      if (message.toLowerCase() === "continue") {
        session.quoteStep = 90;
        return "Would you like to add photos of the job site? (YES/NO)";
      }
      return "After uploading the logo, type CONTINUE.";
 // ── STEP 90 — SITE PHOTOS QUESTION ──────────────────────
    case 90:
      if (message.toLowerCase() === "yes") {
        window.showJobPhotoUploader();
        session.quoteStep = 91;
        return "Please select your job photos and then type CONTINUE.";
      }
      if (message.toLowerCase() === "no") {
        session.quoteStep = 11;
        return buildQuoteSummary(
          getUploadedLogo() ? "Uploaded" : "Not included",
          "Not included"
        );
      }
      return "Please answer YES or NO.";

    // ── STEP 91 — WAITING FOR PHOTOS ─────────────────────────
    case 91:
      if (message.toLowerCase() === "continue") {
        session.quoteStep = 11;
        const count = getJobPhotos().length;
        return buildQuoteSummary(
          getUploadedLogo() ? "Uploaded" : "Not included",
          count ? `${count} photo(s) included` : "Not included"
        );
      }
      return "After uploading your photos, type CONTINUE.";

    // ── STEP 11 — CONFIRM & GENERATE ────────────────────────────
   case 11:
      if (message.toLowerCase() === "yes") {
        generateQuotePDF(session.quoteData, getUploadedLogo(), getJobPhotos());
        window.hideLogoUploader();
        window.hideJobPhotoUploader();
        clearJobPhotos();
        session.activeFlow = null;
        session.quoteStep = 0;
        session.quoteData = {};
        return "Quote generated and downloaded ✅ Type 'create quote' to make another.";
      }
      return "Type YES to confirm, or start again with 'create quote'.";  
  }

  return "Something went wrong. Please type 'create quote' to start again.";
}