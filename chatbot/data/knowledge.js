// knowledge.js

export const knowledge = {
services:{
keywords: [
"services",
"what do you do",
"what can you do",
"your services",
"offer",
"help",
"hire",
"what you do"
],

response: "You can hire me for paint, decorate, fix some cracks, colour advice and so on... Do you have the paint quantity? i can tell you know, just ask me how much paint."
},
  
smallTalk: {
keywords: [
"how are you",
"how are you doing",
"you ok",
"how is it going",
  "hows it going"
],

response: "I'm doing great, thanks! Ready to help with your painting project."
},

thanks: {
keywords: [
"thanks",
"thank you",
"cheers"
],

response: "You're welcome! Let me know if you need anything else."
},

goodbye: {
keywords: [
"bye",
"goodbye",
"see you"
],

response: "Goodbye! Good luck with your project 🎨"
},
  
greeting: {
keywords: [
"hi",
"hello",
"hey",
"good morning",
"good afternoon"
],

response: "Hello! How can I help with your painting project?"
},

crackRepair: {
keywords: [
"crack",
"wall crack",
"repair crack"
],

materials: [
"Wall filler",
"Putty knife",
"120 grit sandpaper",
"Primer",
"Interior paint"
],

steps: [
"Open the crack slightly",
"Remove dust from the crack",
"Apply wall filler with a putty knife",
"Let the filler dry completely",
"Sand smooth",
"Apply primer",
"Paint two coats"
]
},

peelingPaint: {
keywords: [
"peeling",
"peeling paint",
"paint peeling"
],

materials: [
"Paint scraper",
"Sandpaper",
"Primer",
"Interior paint"
],

steps: [
"Scrape loose paint",
"Sand the surface",
"Clean the dust",
"Apply primer",
"Paint two coats"
]
},

paintCoats: {
  keywords: [
    "coats",
    "how many coats",
    "paint coats",
    "number of coats",
    "coats needed"
  ],

  response:
    "For most walls, 2 coats are recommended for a solid and even finish. If the colour change is strong (e.g. dark to light), 3 coats may be needed."
},

colourAdvice: {
  keywords: [
    "colour",
    "color",
    "best paint colour",
    "paint color",
    "dulux",
    "colour ideas",
    "paint ideas"
  ],

  response:
    "I can help you choose the best colours 🎨 Lets start — which room are you painting?"
},

paintQuantity: {
keywords: [
  "decorate",
"paint",
"how much paint",
"paint needed",
"litres of paint",
"paint for",
"paint my flat",
"flat",
"bedroom"
],

response:
"One litre of paint usually covers around 10 square meters depending on the surface."
},
  
costEstimate: {
keywords: [
"cost",
"price",
"quote",
"labour cost",
"how much will it cost",
"estimate cost",
"cost to paint"
],

response:
"I can estimate labour cost if you share dimensions like 5 by 3 metres. You can also include a rate per m2."
},

timeEstimate: {
keywords: [
"time",
"hours",
"long",
"take",
"duration",
"estimate",
"how long",
"how many hours"
],

response:
"A single wall normally takes 2–4 hours including preparation and two coats. standard room usually takes 1–2 days including preparation and painting."
},
  // 🎨 NEW — correctly placed inside object
colourSuggestions: {

    living_room: {
      neutral: ["Warm white", "Soft grey", "Beige"],
      bright: ["Olive green", "Navy feature wall"],
      finish: "Matt or eggshell"
    },

    kitchen: {
      neutral: ["White", "Light grey"],
      bright: ["Sage green"],
      finish: "Satin (easy to clean)"
    },

    bathroom: {
      neutral: ["White", "Light grey", "Soft blue"],
      finish: "Moisture resistant paint"
    },

    bedroom: {
      neutral: ["Warm white", "Light beige"],
      bright: ["Soft blue", "Dusty pink"],
      finish: "Matt"
    }

}

};