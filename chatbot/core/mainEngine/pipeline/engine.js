import { normalize } from "./normalize.js";
import { flowNode } from "./flowNode.js";
import { extractNode } from "./extractNode.js";
import { intentNode } from "./intentNode.js";
import { decisionNode } from "./decisionNode.js";
import { responseNode } from "./responseNode.js";
import { scoreNode } from "./scoreNode.js";
import { brandNode } from "./brandNode.js";

export function processMessage(message){

  let ctx = {
    message,
    intent: null,
    data: {},
    response: null
  };

  ctx = normalize(ctx);

  // 🔥 FLOW HAS PRIORITY
  const flowResponse = flowNode(ctx);
  if (flowResponse) return flowResponse;

  ctx = extractNode(ctx);
  ctx = scoreNode(ctx);   
  ctx = intentNode(ctx);
  ctx = brandNode(ctx);
  ctx = decisionNode(ctx);

  return responseNode(ctx);
}