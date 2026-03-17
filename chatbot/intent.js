// intent.js

import { knowledge } from "./knowledge.js";

export function detectIntent(input){

// Normalize message
input = input
.toLowerCase()
.replace(/[^\w\s]/g, "")
.trim();

// Loop through knowledge topics
for(const topic in knowledge){

const keywords = knowledge[topic].keywords;

// Check keywords
for(const keyword of keywords){

if(input.includes(keyword)){
return topic;
}

}

}

// If nothing matches
return "unknown";

}