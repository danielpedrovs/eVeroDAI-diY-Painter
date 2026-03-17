import { knowledge } from "./knowledge.js";

export function detectIntent(input){

// ignore weak/common words
const stopWords = ["how", "what", "is", "the", "a", "an", "are",
"you", "it", "will", "to", "for", "of", "in"];
  
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

// strong phrase match
if(input.includes(keyword)){
score += 3;
}

// partial word match (filtered)
const words = keyword.split(" ");
for(const word of words){
if(!stopWords.includes(word) && input.includes(word)){
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

// stricter confidence threshold
if(bestScore < 3){
return "unknown";
}

return bestMatch;

}
