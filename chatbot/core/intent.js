import { knowledge } from "../data/knowledge.js";

function detectPriority(input){

  if(input.includes("peeling")) return "peelingPaint";
  if(input.includes("crack")) return "crackRepair";

  if (
  input.includes("colour") ||
  input.includes("color") ||
  input.includes("paint idea") ||
  input.includes("paint ideas") ||
  input.includes("colour ideas") ||
  input.includes("colors for") ||
  input.includes("colours for") ||
  input.includes("which colour") ||
  input.includes("what colour")
) {
  return "colour_suggestion";
}

  if(input.includes("paint") || input.includes("how much paint")){
    return "paintQuantity";
  }
 
  if(input.includes("how long")) return "timeEstimate";
  if(input.includes("cost") || input.includes("price") || input.includes("quote")) return "costEstimate";
  if(input.includes("service")) return "services";
  if(input.includes("thank")) return "thanks";
  if(input.includes("bye")) return "goodbye";

  return null;
}


export function detectIntent(input){

// ignore weak/common words
const stopWords = ["how", "what", "is", "the", "a", "an", "are",
"you", "it", "will", "to", "for", "of", "in"];


// Normalize message
input = input
.toLowerCase()
.replace(/[^\w\s]/g, "")
.trim();

const priorityIntent = detectPriority(input);
if(priorityIntent){
  return priorityIntent;
}
  // detect dimensions like "5 by 3", "4x2", "3 2.4"
if (/\d/.test(input)) {
  return "costEstimate";
}

let bestMatch = "unknown";
let bestScore = 0;

// Loop through knowledge topics
for(const topic in knowledge){

const item = knowledge[topic];

//full protection (this is the key)
if(!item || typeof item !== "object" || !Array.isArray(item.keywords)){
  continue;
}

  const keywords = item.keywords;
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
if(bestScore < 2){
return "unknown";
}

  
return bestMatch;

}
