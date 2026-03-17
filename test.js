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
    "how long it will take",
 "the paint is peeling",
    "how long it will take",
    "how much will it cost 5 by 3 at 20 per m2"
];

for(let msg of tests){

    console.log("\nUser:", msg);

    let response = processMessage(msg);

    console.log("Bot:", response);
}
