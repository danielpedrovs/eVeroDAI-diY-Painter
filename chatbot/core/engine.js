import { detectIntentBrain } from "./brainIntent.js";
import { detectIntent } from "./intent.js";
import { handlers } from "../handlers/handlers.js";
import { extractDimensions } from "../domain/parser.js";
import { session } from "./session.js";



export function processMessage(message){

  message = message.toLowerCase().trim();
  
const isYes = ["yes", "yeah", "yep"].includes(message);
const isNo = ["no", "nope"].includes(message);

    if(isYes || isNo){

    if(session.lastIntent === "paintQuantity"){
      session.includeCeiling = isYes;

      return handlers.paintQuantity(message);
    }

  }
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
