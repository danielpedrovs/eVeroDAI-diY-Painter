const net = new brain.NeuralNetwork();

net.train([
{ input: {paint:1}, output:{paintQuantity:1}},
{ input: {room:1}, output:{paintQuantity:1}},
{ input: {wall:1}, output:{paintQuantity:1}},

{ input: {hello:1}, output:{greeting:1}},
{ input: {hi:1}, output:{greeting:1}}
]);

function detectIntentBrain(message){

message = message.toLowerCase();

const input = {
paint: message.includes("paint") ? 1 : 0,
room: message.includes("room") ? 1 : 0,
wall: message.includes("wall") ? 1 : 0,
hello: message.includes("hello") ? 1 : 0,
hi: message.includes("hi") ? 1 : 0
};

const result = net.run(input);

let intent = Object.keys(result).reduce((a,b)=>result[a] > result[b] ? a : b);

return intent;
}