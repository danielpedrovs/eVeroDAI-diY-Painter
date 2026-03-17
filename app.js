import { processMessage } from "./chatbot/core/engine.js";

function sendMessage(){

let inputField = document.getElementById("user-input");
let input = inputField.value;

let chatBox = document.getElementById("chat-box");

if(input.trim() === "") return;


// USER MESSAGE

let userMessage = document.createElement("div");
userMessage.className = "message user";
userMessage.innerText = input;

chatBox.appendChild(userMessage);

let response = processMessage(input);

// BOT MESSAGE

let botMessage = document.createElement("div");
botMessage.className = "message bot";
botMessage.innerText = response;

chatBox.appendChild(botMessage);

inputField.value = "";
chatBox.scrollTop = chatBox.scrollHeight;

}

window.sendMessage = sendMessage;

// ENTER KEY

document.addEventListener("DOMContentLoaded", () => {
let input = document.getElementById("user-input");
input.addEventListener("keypress", function(event){

if(event.key === "Enter"){
sendMessage();
}

});

});
