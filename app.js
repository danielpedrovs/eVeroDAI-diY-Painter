import { processMessage } from "./chatbot/core/mainEngine/pipeline/engine.js";
import { setUploadedLogo } from "./chatbot/core/logoStore.js";
import { addJobPhoto, clearJobPhotos } from "./chatbot/core/jobPhotoStore.js";

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

let uploadedLogo = null;

window.sendMessage = sendMessage;

// ENTER KEY

document.addEventListener("DOMContentLoaded", () => {
let input = document.getElementById("user-input");
input.addEventListener("keypress", function(event){

if(event.key === "Enter"){
sendMessage();
}
});


document
  .getElementById("logo-upload")
  .addEventListener("change", function(event){

    const file = event.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

      setUploadedLogo(e.target.result);

      console.log("Logo loaded");
    };

    reader.readAsDataURL(file);

});

document
  .getElementById("job-photos-upload")
  .addEventListener("change", function(event){

    const files = Array.from(event.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => addJobPhoto(e.target.result);
      reader.readAsDataURL(file);
    });

    console.log(`${files.length} job photo(s) loaded`);
});

});

window.showLogoUploader = function() {

  document
    .getElementById("logo-upload")
    .style.display = "block";

};

window.hideLogoUploader = function() {

  document
    .getElementById("logo-upload")
    .style.display = "none";

};

window.showLogoUploader = function() {
  document.getElementById("logo-upload").style.display = "block";
};

window.hideLogoUploader = function() {
  document.getElementById("logo-upload").style.display = "none";
};

window.showJobPhotoUploader = function() {
  document.getElementById("job-photos-upload").style.display = "block";
};

window.hideJobPhotoUploader = function() {
  document.getElementById("job-photos-upload").style.display = "none";
};

