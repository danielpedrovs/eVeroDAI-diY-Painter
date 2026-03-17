import { processMessage } from "./chatbot/engine.js";

const tests = [
    "hello",
    "how much paint 4 walls 5 by 3",
    "my wall has a crack",
    "the paint is peeling"
      "hello",
    "how much paint 4 walls 5 by 3",
    "my wall has a crack",
    "the paint is peeling"
    "the paint is peeling",
    "how long it will take"
];

for(let msg of tests){

    console.log("\nUser:", msg);

    let response = processMessage(msg);

    console.log("Bot:", response);
}
