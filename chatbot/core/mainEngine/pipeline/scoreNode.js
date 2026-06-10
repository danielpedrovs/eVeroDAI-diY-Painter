import { knowledge } from "../../../data/knowledge.js";
import { session } from "../../session.js";

export function scoreNode(ctx) {

  const message = ctx.message;
  const scores = [];

  for (const [intent, item] of Object.entries(knowledge)) {

    if (!item?.keywords) continue;

    let score = 0;

    for (const keyword of item.keywords) {

      // strong match
      if (message.includes(keyword)) {
        score += 3;
      }

      // partial match
      const words = keyword.split(" ");
      for (const word of words) {
        if (word.length > 2 && message.includes(word)) {
          score += 1;
        }
      }
    }

    // 🔥 CONTEXT BOOST (VERY IMPORTANT)
    if (session.lastIntent === intent) {
      score += 2;
    }

    if (score > 0) {
      scores.push({ intent, score });
    }
  }

  // sort highest score first
  scores.sort((a, b) => b.score - a.score);

  ctx.scores = scores;

  return ctx;
}