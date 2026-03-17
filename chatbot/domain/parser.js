export function extractDimensions(text){

text = text.toLowerCase();

// pattern: 5x3 or 5 x 3
let match = text.match(/(\d+(\.\d+)?)\s*x\s*(\d+(\.\d+)?)/);

if(match){
return {
width: parseFloat(match[1]),
height: parseFloat(match[3])
};
}

// pattern: 5 by 3
match = text.match(/(\d+(\.\d+)?)\s*by\s*(\d+(\.\d+)?)/);

if(match){
return {
width: parseFloat(match[1]),
height: parseFloat(match[3])
};
}

// pattern: 5 meters wide and 3 meters high
match = text.match(/(\d+(\.\d+)?)\s*meters?\s*wide\s*and\s*(\d+(\.\d+)?)\s*meters?\s*high/);

if(match){
return {
width: parseFloat(match[1]),
height: parseFloat(match[3])
};
}   


return null;

}

export function extractRatePerSquareMeter(text){

text = text.toLowerCase();

let match = text.match(/(\d+(\.\d+)?)\s*(per\s*m2|\/m2|per\s*sqm)/);

if(match){
return parseFloat(match[1]);
}

return null;

}
