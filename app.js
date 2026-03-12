let state = "idle";

function extractDimensions(text){

let numbers = text.match(/\d+(\.\d+)?/g);

if(numbers && numbers.length >= 2){

return {
width: parseFloat(numbers[0]),
height: parseFloat(numbers[1])
};

}

return null;

}

function sendMessage(){

let inputField = document.getElementById("user-input");
let input = inputField.value.toLowerCase();
let chatBox = document.getElementById("chat-box");

if(input.trim() === "") return;


// USER MESSAGE

let userMessage = document.createElement("div");
userMessage.className = "message user";
userMessage.innerText = input;

chatBox.appendChild(userMessage);

let response = "";


// ---------- STATE MACHINE ----------

switch(state){

case "waitingDimensionsPaint":

let dimsPaint = extractDimensions(input);

if(dimsPaint){

let area = dimsPaint.width * dimsPaint.height;
let litres = (area / 10).toFixed(2);

response =
"Wall area: " + area + " m².\n\n" +
"You will need about " + litres + " litres of paint per coat.";

state = "idle";

}else{

response = "Please provide dimensions like: 3 by 2.4 metres.";

}

break;


case "waitingDimensionsTime":

let dimsTime = extractDimensions(input);

if(dimsTime){

let area = dimsTime.width * dimsTime.height;
let hours = (area / 10).toFixed(1);

response =
"Wall area: " + area + " m².\n\n" +
"Estimated work time: about " + hours + " hours.";

state = "idle";

}else{

response = "Please provide dimensions like: 3 by 2.4 metres.";

}

break;


default:

if(input.includes("time") || input.includes("hours")){

response =
"To estimate the time I need the wall dimensions.\n\nExample: 3 by 2.4 metres.";

state = "waitingDimensionsTime";

}

else if(input.includes("paint") || input.includes("how much")){

response =
"What are the wall dimensions?\n\nExample: 3 by 2.4 metres.";

state = "waitingDimensionsPaint";

}

else if(input.includes("crack")){

response =
"To repair a wall crack:\n\n" +
"• Apply filler\n" +
"• Sand smooth\n" +
"• Apply primer\n" +
"• Repaint";

}

else if(input.includes("peeling")){

response =
"Peeling paint steps:\n\n" +
"1 Scrape loose paint\n" +
"2 Sand surface\n" +
"3 Apply primer\n" +
"4 Repaint";

}

else{

response =
"I can help with:\n\n" +
"• cracks\n" +
"• peeling paint\n" +
"• paint quantity\n" +
"• time estimation";

}

}


// BOT MESSAGE

let botMessage = document.createElement("div");
botMessage.className = "message bot";
botMessage.innerText = response;

chatBox.appendChild(botMessage);

inputField.value = "";

chatBox.scrollTop = chatBox.scrollHeight;

}


// ENTER KEY

document.getElementById("user-input")
.addEventListener("keypress", function(event){

if(event.key === "Enter"){
sendMessage();
}

});