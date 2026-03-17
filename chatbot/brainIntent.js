import { detectIntent } from "./intent.js";
import { handlers } from "./handlers.js";

let lastIntent = null;

// simple AI intent detection
function detectIntentBrain(message){

message = message.toLowerCase();

if(message.includes("paint") || message.includes("wall") || message.includes("room")){
    return "paintQuantity";
}

if(message.includes("hello") || message.includes("hi")){
    return "greeting";
}

return "unknown";
}

export function processMessage(message){

message = message.toLowerCase();

// try AI detection
let intent = detectIntentBrain(message);

// fallback to keyword detection
if(intent === "unknown"){
    intent = detectIntent(message);
}

// keep conversation context
if(intent === "unknown" && lastIntent === "paintQuantity"){
    intent = "paintQuantity";
}

let handler = handlers[intent] || handlers.unknown;

lastIntent = intent;

return handler(message);

}