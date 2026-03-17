import { responses } from "../data/responses.js";
import { extractDimensions, extractRatePerSquareMeter } from "../domain/parser.js";
import { estimateLabourCost, formatMoney, getDefaultRatePerM2 } from "../domain/costlibrary.js";
import { problems } from "../data/problems.js";
import { handlePaintFlow } from "../flows/paintFlow.js";
import { knowledge } from "../data/knowledge.js";
import { session } from "../core/session.js";

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
    
const result = handlePaintFlow(message, session);

  if(typeof result === "string"){
    return result;
  }

    return `paintable surfaces:

walls: ${result.wallsArea.toFixed(1)} m²
ceiling: ${result.ceilingArea.toFixed(1)} m²
total: ${result.totalArea.toFixed(1)} m²

You will need:

• ${result.litresPerCoat.toFixed(1)}L per coat`;
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

    return `its just an market estimated labour cost:

area: ${area.toFixed(1)} m²
rate: ${formatMoney(rate)} per m²
total: ${formatMoney(total)}, please contact 
the painter for accurate costs`;
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