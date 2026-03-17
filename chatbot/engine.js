import { detectIntent } from "./intent.js";
import { handlers } from "./handlers.js";

let intent = null;

export function processMessage(message){
message = message.toLowerCase();

//detect intent
let intent = detectIntent(message);
// if no intent
if(intent === "unknown" && lastIntent === "paintQuantity"){
    intent = "paintQuantity";
    }
let handler = handlers[intent] || handlers.unknown;
let lastIntent = null;
lastIntent = intent;


return handler(message);

}
