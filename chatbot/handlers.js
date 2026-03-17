import { responses } from "./responses.js";
import { extractDimensions } from "./parser.js";
import { problems } from "./problems.js";
import { knowledge } from "./knowledge.js";

function formatSolution(problem){

let materials = problem.materials || [];
let steps = problem.steps || [];

return "Materials needed:\n\n" +
materials.map(m => "• " + m).join("\n") +

"\n\nSteps:\n\n" +
steps.map((s,i) => (i+1) + ". " + s).join("\n");

}

function solveProblem(message){
    for(let key in knowledge){
        let problem = knowledge[key];
         // ✅ ONLY process items that actually have steps/materials
        if(!problem.materials && !problem.steps){
            continue;
        }

        for (let word of problem.keywords){
            if(message.includes(word)){
                return formatSolution(problem);
            }
        }
            }
            return  null;
        }

export const handlers = {

greeting(){
    return responses.greeting;
},

paintQuantity(message){
    let dims = extractDimensions(message);

    if(!dims){
    return responses.paintQuantity;
}
/* 
dims expected:
width
length
height
walls (optional)
*/

let width = dims.width;
let length = dims.length || width; // if length not provided, assume it's a square
let height = dims.height || 2.4; // default height if not provided
// calculate perimeter
let perimeter = 2 * (width + length);

//wall area
let wallsArea = perimeter * height;
// ceiling area
let ceilingArea = width * length;
//total paintable 
let totalArea = wallsArea + ceilingArea;

//paint coverage: 1 litre covers 10 m²
let litres = (totalArea / 10).toFixed(2);
return `paintable surfaces: 

walls: ${wallsArea.toFixed(1)} m²
ceiling: ${ceilingArea.toFixed(1)} m²
total paintable area: ${totalArea.toFixed(1)} m²
You will need about ${litres} litres of paint per coat.`;
},

peelingPaint(){
    return responses.peelingPaint;
},

crackRepair(){
    let p = problems.crack;
    return "Materials needed:\n" + p.materials.map(m => `- ${m}`).join("\n") + 
    "\n\nSteps:\n" + p.steps.map((s, i) => `${i+1}. ${s}`).join("\n");
},

smallTalk(){
    return knowledge.smallTalk.response;
},

thanks(){
    return knowledge.thanks.response;
},

goodbye(){
    return knowledge.goodbye.response;
},
    
unknown(message){

let solution = solveProblem(message);

if(solution){
return solution;
}
    return responses.unknown;
}

};
