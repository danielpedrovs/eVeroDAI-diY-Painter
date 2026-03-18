import { brands } from "../../../../data/brands.js";

export function brandNode(ctx) {

  const msg = ctx.message;

  const isBrandQuery =
    msg.includes("brand") ||
    msg.includes("paint brand") ||
    msg.includes("which paint");

  if (!isBrandQuery) return ctx;

  // detect budget
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