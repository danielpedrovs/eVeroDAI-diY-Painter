import { handlers } from "../../../handlers/handlers.js";
import { handleInvoiceFlow } from "../../../flows/invoiceFlow.js";
import { profile } from "../../../domain/config/companyprofile.js";
import { handleQuoteFlow } from "../../../flows/quoteFlow.js";
import { parseQuotePhrase } from "../../../domain/config/quoteParser.js";
import { handleContactFlow } from "../../../flows/contactflow.js";
import { session, saveSession } from "../../session.js";
// ...all your existing imports stay the same


export function flowNodeInner(ctx) {

  const message = ctx.message;


  console.log("flowNode running — message:", message);
  console.log("activeFlow:", session.activeFlow);
  console.log("invoiceStep:", session.invoiceStep);

  // 🔥 HARD FLOW LOCK
  if (session.activeFlow === "colour") {

    const exitFlow =
      message.includes("cancel") ||
      message.includes("stop");

    if (!exitFlow) {
      return handlers.colour_suggestion(message);
    }

    session.activeFlow = null;
  }

  if (session.activeFlow === "contact") {
  return handleContactFlow(message);
}

  if (session.activeFlow === "invoice") {
  return handleInvoiceFlow(message);
}

  // 🎨 START FLOW
  if (
    !session.activeFlow &&
    (message.includes("colour") || message.includes("color") || message.includes("paint idea"))
  ) {
    session.activeFlow = "colour";
    return handlers.colour_suggestion(message);
  }

  // 👍 YES / NO
  const isYes = ["yes", "yeah", "yep"].includes(message);
  const isNo = ["no", "nope"].includes(message);

  if (isYes || isNo) {
    if (session.lastIntent === "paintQuantity") {
      session.includeCeiling = isYes;
      return handlers.paintQuantity(message);
    }
  }
if (
  !session.activeFlow &&
  (
    message.includes("contact") ||
    message.includes("call me") ||
    message.includes("phone number") ||
    message.includes("get in touch")
  )
) {
  session.activeFlow = "contact";
  session.contactStep = 1;
  session.contactData = {};

  return "No problem 👋 What's the best phone number to reach you on?";
}

  if (
  !session.activeFlow &&
  (
    message.includes("invoice") ||
    message.includes("create invoice")
  )
) {

  session.activeFlow = "invoice";
  session.invoiceStep = 2;
  session.invoiceData = {};

  return `Use default business details? Type YES to use these or NO to enter new ones.`;
}
if (session.activeFlow === "quote") {
    return handleQuoteFlow(message);
  }

  if (
    !session.activeFlow &&
    (message.includes("quote") || message.includes("create quote"))
  ) {
    session.activeFlow = "quote";
    session.quoteStep = 1;
    session.quoteData = {};

    // Fast path — try to parse the full phrase in one go.
    // Use the ORIGINAL (non-lowercased) message so names keep their capitalisation.
    const parsed = parseQuotePhrase(ctx.OriginalMessage || message);

    if (parsed.customerName && parsed.description && parsed.price) {
      session.quoteData.customerName = parsed.customerName;
      session.quoteData.description = parsed.description;
      session.quoteData.amount = parsed.price;
    }
    
     if (parsed.address) {
      session.quoteData.customerAddress = parsed.address;
    }

    return "Are you an existing customer looking for a quote, or a sole trader wanting to create your own quotes with eVeroDAI?";
  }

  return null;
}

export function flowNode(ctx) {
  const result = flowNodeInner(ctx);
  saveSession();
  return result;
}