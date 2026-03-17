export function extractDimensions(text){

  text = text.toLowerCase();

  let dims = {};

  // 🔥 detect walls FIRST
  let wallsMatch = text.match(/(\d+(\.\d+)?)\s*(wall|walls)/);

  if(wallsMatch){
    dims.walls = parseFloat(wallsMatch[1]);
  }

  // pattern: 5x3 or 5 x 3
  let match = text.match(/(\d+(\.\d+)?)\s*x\s*(\d+(\.\d+)?)/);

  if(match){
    dims.width = parseFloat(match[1]);
    dims.height = parseFloat(match[3]);
    return dims;
  }

  // pattern: 5 by 3
  match = text.match(/(\d+(\.\d+)?)\s*by\s*(\d+(\.\d+)?)/);

  if(match){
    dims.width = parseFloat(match[1]);
    dims.height = parseFloat(match[3]);
    return dims;
  }

  // pattern: 5 meters wide and 3 meters high
  match = text.match(/(\d+(\.\d+)?)\s*meters?\s*wide\s*and\s*(\d+(\.\d+)?)\s*meters?\s*high/);

  if(match){
    dims.width = parseFloat(match[1]);
    dims.height = parseFloat(match[3]);
    return dims;
  }

  // 🔥 NEW: return walls-only if present
  if(dims.walls){
    return dims;
  }

  return null;
}

export function extractRatePerSquareMeter(text){

  text = text.toLowerCase();

  // 🔥 pattern 1: "£20 per m2", "20 per m2", "20/m2"
  let match = text.match(/(?:£|\$)?\s*(\d+(\.\d+)?)\s*(per\s*m2|\/m2|per\s*sqm)/);

  if(match){
    return parseFloat(match[1]);
  }

  // 🔥 pattern 2: "at 20", "rate 20"
  match = text.match(/(?:at|rate|for)\s*(?:£|\$)?\s*(\d+(\.\d+)?)/);

  if(match){
    return parseFloat(match[1]);
  }

  return null;
}