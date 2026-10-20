import { normalize } from "./normalize.js";
import { flowNode } from "./flowNode.js";
import { extractNode } from "./extractNode.js";
import { intentNode } from "./intentNode.js";
import { decisionNode } from "./decisionNode.js";
import { responseNode } from "./responseNode.js";
import { scoreNode } from "./scoreNode.js";
import { brandNode } from "./brandNode.js";
import { handleInvoiceFlow } from "../../../flows/invoiceFlow.js";
import { correctTypos } from "./fuzzy.js";
import { session, resetFlows } from "../../../core/session.js";
import { answerTriage, followUp } from "../../../data/content/problemAnswer.js";



const EXIT_WORDS = /^(cancel|stop|exit|quit|back|menu|reset|start over|new question)$/;

export function processMessage(message){

  let ctx = {
    message,
    OriginalMessage: message,
    intent: null,
    data: {},
    response: null
  };

  ctx = normalize(ctx);
    // global escape works inside every flow, including the password step
  if (EXIT_WORDS.test(ctx.message.trim())) {
    resetFlows();
    return "No problem, what would you like to do?";
  }
if (session.pendingTriage) {
    const r = answerTriage(ctx.message, session);
    if (r) {return r;}
  }

  const fu = followUp(ctx.message, session);
  if (fu) return fu;

  if (session.activeFlow) {
    if (flowExpectsAnswer(ctx)) {
    const r = flowNode(ctx);
      if (r) return r;
    }
    resetFlows(); // topic changed
  }




  // 🔥 FLOW HAS PRIORITY
  const flowResponse = flowNode(ctx);
  if (flowResponse) return flowResponse;


  ctx.message = correctTypos(ctx.message); 
  ctx = extractNode(ctx);
  ctx = scoreNode(ctx);   
  ctx = intentNode(ctx);
  ctx = brandNode(ctx);
  ctx = decisionNode(ctx);

  
  return responseNode(ctx);

  
}


function flowExpectsAnswer(ctx) {
   const f = session.activeFlow;
  if (["invoice", "quote", "contact", "colour"].includes(f)) return true;
  if (f === "paint")
    return /\d/.test(ctx.message) || /^(yes|no|walls|ceiling|both)$/.test(ctx.message);
  return false;
}

export function detectIntent(message) {
  let ctx = normalize({ message, OriginalMessage: message, intent: null, data: {}, response: null });
  ctx.message = correctTypos(ctx.message);
  ctx = scoreNode(ctx);
  ctx = intentNode(ctx);
  return ctx.intent;
}