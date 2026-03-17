import { detectIntentBrain } from "./brainIntent.js";
import { detectIntent } from "./intent.js";
import { handlers } from "./handlers.js";
import { extractDimensions } from "./parser.js";

let session = {
  lastIntent: null,
  dimensions: null
};

export function processMessage(message){

  message = message.toLowerCase().trim();

  // 1. detect intent
  let intent = detectIntentBrain(message);

  if(!intent || intent === "unknown"){
      intent = detectIntent(message);
  }

  // 2. extract dimensions
  const dims = extractDimensions(message);
  if(dims){
    session.dimensions = dims;
  }

  const hasDimensions = /\d+(\.\d+)?\s*(x|by)?\s*\d+/.test(message);

  // 🔥 CORE RULE (this alone is enough)
  if(hasDimensions && session.lastIntent){
    intent = session.lastIntent;
  }
// 🔥 ALLOW EXPLICIT SWITCH
const isSwitchingIntent =
  message.includes("cost") ||
  message.includes("price") ||
  message.includes("quote") ||
  message.includes("paint") ||
  message.includes("time");

if(isSwitchingIntent){
    intent = detectIntent(message);
}
  // optional clarification
  if(intent === "unknown" && hasDimensions && !session.lastIntent){
    return "Got it — is this for paint quantity or cost estimation?";
  }

  // 3. handler
  const handler = handlers[intent] || handlers.unknown;

  // 4. store intent correctly
  if(intent !== "unknown"){
    session.lastIntent = intent;
  }

  return handler(message);
}
