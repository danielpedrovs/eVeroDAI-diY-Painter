
// intent.js

export const intents = {

greeting: [
"hi",
"hello",
"hey",
"how are you",
"good morning",
"good afternoon"
],

paintQuantity: [
"paint",
"how much paint",
"paint needed",
"litres of paint"
],

timeEstimate: [
"time",
"hours",
"how long",
"work time"
],

crackRepair: [
"crack",
"wall crack",
"repair crack"
],

peelingPaint: [
"peeling",
"peeling paint",
"paint peeling"
],

colourAdvice: [
"colour",
"color",
"paint colour",
"paint color"
]

};

export function detectIntent(input){

input = input.toLowerCase();

for(const intent in intents){

const keywords = intents[intent];

for(const word of keywords){

if(input.includes(word)){
return intent;
}

}

}

return "Hey, could you describe better?";

}
