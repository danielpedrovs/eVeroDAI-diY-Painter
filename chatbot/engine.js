import { detectIntentBrain } from "./brainIntent.js";
import { detectIntent } from "./intent.js";
import { handlers } from "./handlers.js";

let lastIntent = null; // conversation memory

export function processMessage(message){

message = message.toLowerCase();

let intent = detectIntentBrain(message);



// detect intent
let intent = detectIntent(message);

// if user sends dimensions after asking about paint
if(intent === "unknown" && lastIntent === "paintQuantity"){
    intent = "paintQuantity";
}

let handler = handlers[intent] || handlers.unknown;

// store last intent
lastIntent = intent;

return handler(message);

}