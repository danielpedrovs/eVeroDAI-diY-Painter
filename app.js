function sendMessage(){

let input = document.getElementById("user-input").value
let chatBox = document.getElementById("chat-box")

let userMessage = document.createElement("div")
userMessage.className = "message user"
userMessage.innerText = input

chatBox.appendChild(userMessage)

let response = ""

if(input.toLowerCase().includes("crack")){
response = "To repair a wall crack you need filler, sandpaper, primer and paint."
}

else if(input.toLowerCase().includes("peeling")){
response = "Scrape loose paint, sand the wall, apply primer and repaint."
}

else if(input.toLowerCase().includes("paint")){
response = "Most paints cover around 10m² per litre."
}

else{
response = "Tell me more about the wall problem and I will help."
}

let botMessage = document.createElement("div")
botMessage.className = "message bot"
botMessage.innerText = response

chatBox.appendChild(botMessage)

document.getElementById("user-input").value=""

chatBox.scrollTop = chatBox.scrollHeight

}

let waitingForDimensions = false;

function sendMessage(){

let input = document.getElementById("user-input").value.toLowerCase();
let chatBox = document.getElementById("chat-box");

if(input.trim() === "") return;

// USER MESSAGE

let userMessage = document.createElement("div");
userMessage.className = "message user";
userMessage.innerText = input;

chatBox.appendChild(userMessage);

// BOT RESPONSE

let response = "";

if(waitingForDimensions){

let numbers = input.match(/\d+(.\d+)?/g);

if(numbers && numbers.length >= 2){

let width = parseFloat(numbers[0]);
let height = parseFloat(numbers[1]);

let area = width * height;
let litres = (area / 10).toFixed(2);

response =
"Wall area: " + area + " m².\n\n" +
"You will need approximately " + litres +
" litres of paint per coat.\n\n" +
"Most paints cover around 10m² per litre.";

waitingForDimensions = false;

}else{

response = "Please provide two numbers like: 3 by 2.4 meters.";

}

}

else if(input.includes("paint") || input.includes("how much")){

response =
"Sure. What are the wall dimensions?\n\nExample: 3 by 2.4 metres";

waitingForDimensions = true;

}

else if(input.includes("crack")){

response =
"To repair a wall crack you will need:\n\n" +
"• Wall filler\n" +
"• Putty knife\n" +
"• Sandpaper\n" +
"• Primer\n" +
"• Interior paint\n\n" +
"Steps:\n" +
"1 Open the crack slightly\n" +
"2 Remove dust\n" +
"3 Apply filler\n" +
"4 Sand smooth\n" +
"5 Apply primer\n" +
"6 Paint two coats";

}

else if(input.includes("peeling")){

response =
"Peeling paint usually means poor adhesion.\n\n" +
"Steps:\n" +
"1 Scrape loose paint\n" +
"2 Sand the surface\n" +
"3 Clean dust\n" +
"4 Apply primer\n" +
"5 Repaint";

}

else{

response =
"I can help with:\n\n" +
"• wall cracks\n" +
"• peeling paint\n" +
"• calculating paint needed\n\n" +
"Try asking: 'How much paint do I need?'";

}

let botMessage = document.createElement("div");
botMessage.className = "message bot";
botMessage.innerText = response;

chatBox.appendChild(botMessage);

document.getElementById("user-input").value = "";

chatBox.scrollTop = chatBox.scrollHeight;

}
document.getElementById("user-input")
.addEventListener("keypress", function(event){

if(event.key === "Enter"){
sendMessage();
}

});