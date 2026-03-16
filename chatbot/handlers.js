import { responses } from "./responses.js";
import { extractDimensions } from "./parser.js";
import { problems } from "./problems.js";



export const handlers = {

greeting(){
    return responses.greeting;
},

paintQuantity(message){
    let dims = extractDimensions(message);
    if(!dims){
    return responses.paintQuantity;
}
let area = dims.width * dims.height;   
let litres = (area / 10).toFixed(2);

return `Wall area: ${area} m².
You will need about ${litres} litres of paint per coat.`;
},

crackRepair(){
    return responses.crackRepair;
},

peelingPaint(){
    return responses.peelingPaint;
},

crackRepair(){
    let p = problems.crack;
    return "Materials needed:\n" + p.materials.map(m => `- ${m}`).join("\n") + 
    "\n\nSteps:\n" + p.steps.map((s, i) => `${i+1}. ${s}`).join("\n");
},

unknown(){
    return responses.unknown;
}

};
