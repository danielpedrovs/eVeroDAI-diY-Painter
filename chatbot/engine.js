import { detectIntent } from "./intent.js";
import { handlers } from "./handlers.js";

export function processMessage(message){

let intent = detectIntent(message);

let handler = handlers[intent] || handlers.unknown;

let response = handler(message);

return response;

}
