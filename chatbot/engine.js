import { detectIntentBrain } from "./brainIntent.js";
import { detectIntent } from "./intent.js";
import { handlers } from "./handlers.js";

let lastIntent = null; // conversation memory

export function processMessage(message){

message = message.toLowerCase();

// try neural network first
let intent = detectIntentBrain(message);

// fallback to keyword detection
if(!intent || intent === "unknown"){
    intent = detectIntent(message);
}
    

// detect if message contains dimensions
const hasDimensions = /\d+(\.\d+)?\s*(x|by)?\s*\d+/.test(message);

// if user sends dimensions after a previous intent
if(intent === "unknown" && hasDimensions && lastIntent){
    intent = lastIntent;
}
     if(intent === "unknown" && hasDimensions && !lastIntent){
      return "Got it — is this for paint quantity or cost estimation?";
  }

let handler = handlers[intent] || handlers.unknown;

// store last intent
if(intent !== "unknown"){
    lastIntent = intent;
}
return handler(message);

}
