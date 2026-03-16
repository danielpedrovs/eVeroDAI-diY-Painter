
// intent.js

export const intents = {

greeting: [
"hi",
"hello",
"hey",
"how are you?",
"good morning",
"good afternoon"
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
], 

paintQuantity: [
"how much paint",
"paint needed",
"litres of paint",
"paint for"
],

timeEstimate: [
"time",
"hours",
"how long",
"work time",
"how many hours"
],


};

export function detectIntent(input){
 

input = input.toLowerCase().replace(/[^\w\s]/g, ""); // remove punctuation

for(const intent in intents){

const keywords = intents[intent];

for(const keyword of keywords){

    if(input.includes(keyword)){
return intent;
}

}

}

return "unknown";
}
