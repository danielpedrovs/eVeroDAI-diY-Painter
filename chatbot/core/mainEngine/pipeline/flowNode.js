import { session } from "../../session.js";
import { handlers } from "../../../handlers/handlers.js";
import { handleInvoiceFlow } from "../../../flows/invoiceFlow.js";
import { profile } from "../../../domain/config/companyprofile.js";
import { handleQuoteFlow } from "../../../flows/quoteFlow.js";
import { parseQuotePhrase } from "../../../domain/config/quoteParser.js";

export function flowNode(ctx) {

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
    session.quoteStep = 2;
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

    return `Use default business details? Type YES to use these or NO to enter new ones.`;
  }

  return null;
}