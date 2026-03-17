import { responses } from "./responses.js";
import { extractDimensions, extractRatePerSquareMeter } from "./parser.js";
import { estimateLabourCost, formatMoney, getDefaultRatePerM2 } from "./costlibrary.js";
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

    if(!problem.materials && !problem.steps){
      continue;
    }

    for (let word of problem.keywords){
      if(message.includes(word)){
        return formatSolution(problem);
      }
    }
  }
  return null;
}

export const handlers = {

  greeting(){
    return responses.greeting;
  },

  // 🎨 PAINT QUANTITY
  paintQuantity(message){
    let dims = extractDimensions(message);

    if(!dims){
      return responses.paintQuantity;
    }

    let width = dims.width;
    let length = dims.length || width;
    let height = dims.height || 2.4;
    let walls = dims.walls || 4;

    let wallsArea;

    // ✅ If user specified number of walls
    if(dims.walls){
      wallsArea = width * height * walls;
    } else {
      // ✅ Room-based calculation
      let perimeter = 2 * (width + length);
      wallsArea = perimeter * height;
    }

    let ceilingArea = width * length;
    let totalArea = wallsArea + ceilingArea;

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

  timeEstimate(){
    return responses.timeEstimate;
  },

  // 💰 COST ESTIMATE
  costEstimate(message){
    let dims = extractDimensions(message);

    if(!dims){
      return responses.costEstimate;
    }

    let width = dims.width;
    let height = dims.height || 2.4;
    let walls = dims.walls || 1;

    // ✅ FIXED: include walls
    let area = width * height * walls;

    let rate = extractRatePerSquareMeter(message) || getDefaultRatePerM2();
    let total = estimateLabourCost(area, rate);

    return `estimated labour cost:

area: ${area.toFixed(1)} m²
rate: ${formatMoney(rate)} per m²
total: ${formatMoney(total)}`;
  },

  crackRepair(){
    let p = problems.crack;
    return "Materials needed:\n" +
      p.materials.map(m => `- ${m}`).join("\n") +
      "\n\nSteps:\n" +
      p.steps.map((s, i) => `${i+1}. ${s}`).join("\n");
  },

  smallTalk(){
    return knowledge.smallTalk.response;
  },

  thanks(){
    return knowledge.thanks.response;
  },
  
  paintCoats(){
  return knowledge.paintCoats.response;
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