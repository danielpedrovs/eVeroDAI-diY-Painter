// intent.js

import { knowledge } from "./knowledge.js";

export function detectIntent(input){

// Normalize message
input = input
.toLowerCase()
.replace(/[^\w\s]/g, "")
.trim();

let bestMatch = "unknown";
let bestScore = 0;

// Loop through knowledge topics
for(const topic in knowledge){

const keywords = knowledge[topic].keywords;
let score = 0;
// Check keywords
for(const keyword of keywords){

// full phrase match (strong)
if(input.includes(keyword)){
score += 3;
}
// partial word match (flexible)
const words = keyword.split(" ");
for(const word of words){
if(input.includes(word)){
score += 1;
}
}

}
  // keep best match
if(score > bestScore){
bestScore = score;
bestMatch = topic;
}

}
  // confidence threshold
if(bestScore < 2){
return "unknown";
}

return bestMatch;

}
