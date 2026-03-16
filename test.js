import { detectIntent } from "./chatbot/intent.js";
import { handlers } from "./chatbot/handlers.js";




let message = "how are you?";

let intent = detectIntent(message);

console.log("Available handlers:", Object.keys(handlers));

let handler = handlers[intent] || handlers.unknown;
let response = handler(message);


console.log("User:", message);
console.log("Intent:", intent);
console.log("Response:", response);



