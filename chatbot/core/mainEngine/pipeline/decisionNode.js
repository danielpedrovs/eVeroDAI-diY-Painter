import { detectIntent } from "../../intent.js";
import { session } from "../../session.js";

export function decisionNode(ctx) {

  const { message, intent } = ctx;
  const hasDimensions = ctx.data.hasDimensions;

  let finalIntent = intent;

  // CORE RULE
  if (hasDimensions && session.lastIntent) {
    finalIntent = session.lastIntent;
  }

  // SWITCH INTENT
  const isSwitchingIntent =
    message.includes("cost") ||
    message.includes("price") ||
    message.includes("quote") ||
    message.includes("paint") ||
    message.includes("time");

  if (isSwitchingIntent) {
    finalIntent = detectIntent(message);
  }

  // CLARIFICATION
  if (finalIntent === "unknown" && hasDimensions && !session.lastIntent) {
    ctx.response = "Got it — is this for paint quantity or cost estimation?";
    return ctx;
  }

  ctx.intent = finalIntent;

  return ctx;
}