import { brands } from "../../../data/brands.js";
import { session } from "../../session.js";
import { buildBrandResponse } from "./builders/brandResponseBuilder.js";

// 🧠 Room detection (clean + scalable)
function detectRoom(msg) {

  const rooms = {
    kitchen: ["kitchen"],
    bathroom: ["bathroom"],
    bedroom: ["bedroom", "son", "daughter", "baby", "kids"],
    living_room: ["living", "lounge"]
  };

  for (const [room, keywords] of Object.entries(rooms)) {
    if (keywords.some(k => msg.includes(k))) {
      return room;
    }
  }

  return null;
}

// 🧠 Room-based recommendations
function getRoomRecommendation(room) {

  if (room === "kitchen") {
    return `Great 👍 For a kitchen, I’d recommend:

• Dulux Trade Diamond – very durable and washable  
• Crown Clean Extreme – stain resistant  

💡 Kitchens need paints that resist grease and can be cleaned easily.

Would you like colour suggestions as well?`;
  }

  if (room === "bathroom") {
    return `For a bathroom, moisture resistance is key:

• Dulux Trade Mouldshield  
• Zinsser Perma-White  

💡 These help prevent mould and humidity damage.`;
  }

  if (room === "bedroom") {
    return `For a bedroom, you can go for comfort and finish:

• Dulux Trade Vinyl Matt  
• Crown Trade Matt  

💡 Focus on smooth finish and calm atmosphere.`;
  }

  return "I can suggest the best paint depending on the room 👍";
}

// 🎯 MAIN NODE
export function brandNode(ctx) {

  const msg = ctx.message;

  const isBrandQuery =
    msg.includes("brand") ||
    msg.includes("paint brand") ||
    msg.includes("which paint");

  const room = detectRoom(msg);

  // 🔥 CONTEXT CONTINUATION (this is correct)
  if (session.lastTopic === "brand" && room) {

    ctx.response = getRoomRecommendation(room);
    return ctx;
  }

  // Not a brand request → skip
  if (!isBrandQuery) return ctx;

  // Activate brand context
  session.lastTopic = "brand";

  let category = "mid";

  if (msg.includes("cheap") || msg.includes("budget")) {
    category = "budget";
  }

  if (msg.includes("premium") || msg.includes("best")) {
    category = "premium";
  }

  const selected = brands[category];

  ctx.response = buildBrandResponse(selected, category);

  return ctx;
}