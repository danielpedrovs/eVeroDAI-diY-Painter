import { detectIntentBrain } from "./brainIntent.js";
import { detectIntent } from "./intent.js";
import { handlers } from "../handlers/handlers.js";
import { extractDimensions } from "../domain/parser.js";
import { session } from "./session.js";



export function processMessage(message){

  message = message.toLowerCase().trim();
  
const isYes = ["yes", "yeah", "yep"].includes(message);
const isNo = ["no", "nope"].includes(message);

// 🔥1. HARD FLOW LOCK (cannot be overridden)
if (session.activeFlow === "colour") {

  const exitFlow =
    message.includes("cancel") ||
    message.includes("stop");

  if (!exitFlow) {
    return handlers.colour_suggestion(message);
  }
      // exit flow
    session.activeFlow = null;
  }
  // 🎨 2. START FLOW (ONLY IF NOT ACTIVE)
  if (
    !session.activeFlow &&
    (message.includes("colour") || message.includes("color")||message.includes("paint idea"))
  ) {
    session.activeFlow = "colour";
    return handlers.colour_suggestion(message);
  }
  

  // 👍 3. YES / NO LOGIC
    if(isYes || isNo){

    if(session.lastIntent === "paintQuantity"){
      session.includeCeiling = isYes;

      return handlers.paintQuantity(message);
    }

  }


  // 🧠 4. INTENT DETECTION
  let intent = detectIntentBrain(message);

  if (!intent || intent === "unknown") {
    intent = detectIntent(message);
  }

  // 5. extract dimensions
  const dims = extractDimensions(message);
  if(dims){
    session.dimensions = dims;
  }

  const hasDimensions = /\d+(\.\d+)?\s*(x|by)?\s*\d+/.test(message);

  // 🔥6. CORE RULE (this alone is enough)
  if(hasDimensions && session.lastIntent){
    intent = session.lastIntent;
  }
// 🔥 7.ALLOW EXPLICIT SWITCH
const isSwitchingIntent =
  message.includes("cost") ||
  message.includes("price") ||
  message.includes("quote") ||
  message.includes("paint") ||
  message.includes("time");

if(isSwitchingIntent){
    intent = detectIntent(message);
}
  //8. optional clarification
  if(intent === "unknown" && hasDimensions && !session.lastIntent){
    return "Got it — is this for paint quantity or cost estimation?";
  }

  // 9. handler
  const handler = handlers[intent] || handlers.unknown;


  
  // 10. store intent correctly
  if(intent !== "unknown"){
    session.lastIntent = intent;
  }

  return handler(message);
}


