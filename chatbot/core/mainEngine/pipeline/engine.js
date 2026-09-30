import { normalize } from "./normalize.js";
import { flowNode } from "./flowNode.js";
import { extractNode } from "./extractNode.js";
import { intentNode } from "./intentNode.js";
import { decisionNode } from "./decisionNode.js";
import { responseNode } from "./responseNode.js";
import { scoreNode } from "./scoreNode.js";
import { brandNode } from "./brandNode.js";
import { handleInvoiceFlow } from "../../../flows/invoiceFlow.js";
import { session, resetFlows } from "../../../core/session.js";

export function processMessage(message){

  let ctx = {
    message,
    OriginalMessage: message,
    intent: null,
    data: {},
    response: null
  };

  ctx = normalize(ctx);
  // global escape
  if (/^(cancel|stop|start over|new question)$/.test(ctx.message)) {
    resetFlows();
    return "No problem, what would you like to do?";
  }

  if (session.activeFlow) {
    if (flowExpectsAnswer(ctx)) {
      const flowResponse = flowNode(ctx);
      if (flowResponse) return flowResponse;
    } else {
      resetFlows();            // user changed topic, so fall through to the normal pipeline
    }
  }


  // 🔥 FLOW HAS PRIORITY
  const flowResponse = flowNode(ctx);
  if (flowResponse) return flowResponse;
console.log("engine its running");


  ctx = extractNode(ctx);
  ctx = scoreNode(ctx);   
  ctx = intentNode(ctx);
  ctx = brandNode(ctx);
  ctx = decisionNode(ctx);

  return responseNode(ctx);
}

function flowExpectsAnswer(ctx) {
  // invoice and quote are free-text forms: only CANCEL leaves them
  if (session.activeFlow === "invoice" || session.activeFlow === "quote") return true;
  // paint flow expects numbers or a short choice
  if (session.activeFlow === "paint")
    return /\d/.test(ctx.message) || /^(yes|no|walls|ceiling|both)$/.test(ctx.message);
  return false;
}