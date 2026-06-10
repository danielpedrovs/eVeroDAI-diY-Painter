export function calculatePaint({ width, length, height, walls, includeCeiling }) {

  let wallsArea;

  if(walls){
    wallsArea = width * height * walls;
  } else {
    let perimeter = 2 * (width + length);
    wallsArea = perimeter * height;
  }

  let ceilingArea = includeCeiling ? width * length : 0;

  let totalArea = wallsArea + ceilingArea;

  let litresPerCoat = totalArea / 10;

  return {
    wallsArea,
    ceilingArea,
    totalArea,
    litresPerCoat
  };
}