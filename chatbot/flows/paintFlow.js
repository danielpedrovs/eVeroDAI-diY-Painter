import { calculatePaint } from "../domain/calculator.js";
import { extractDimensions } from "../domain/parser.js";

export function handlePaintFlow(message, session){

  let dims = extractDimensions(message);

  if(dims){
    session.dimensions = dims;
  }

  if(!session.dimensions){
    return "Tell me the wall size (e.g. 3 by 2.4).";
  }

  // ask about ceiling
  if(session.includeCeiling === null){
    return "Do you want to include the ceiling?";
  }

  let { width, length, height, walls } = session.dimensions;

  let result = calculatePaint({
    width,
    length: length || width,
    height: height || 2.4,
    walls: walls || 1,
    includeCeiling: session.includeCeiling
  });

  return result;
}