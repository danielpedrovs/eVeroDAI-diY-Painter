import { detectIntent } from "../../intent.js";
import { session } from "../../session.js";

export function decisionNode(ctx) {

  const { message, intent } = ctx;
  const hasDimensions = ctx.data?.hasDimensions;

  let finalIntent = intent;

  // CORE RULE
  if (hasDimensions && session.lastIntent) {
    finalIntent = session.lastIntent;
  }

// use word boundaries so "sometimes" doesn't trigger "time"
const isSwitchingIntent = /\b(cost|price|quote|paint|time)\b/i.test(message);

  if (isSwitchingIntent) {
    finalIntent = detectIntent(message);
  }

    // IMPORTANT:
  // Store the final decision BEFORE using it below.
  ctx.intent = finalIntent;

  // CLARIFICATION
  if (finalIntent === "unknown" && hasDimensions && !session.lastIntent) {
    ctx.response = "Got it — is this for paint quantity or cost estimation?";
    return ctx;
  }

   // Existing specialist flow
  if (session.activeFlow) {
    ctx.decision = "active_flow";
    return ctx;
  }

  // User is answering a problem question
  if (session.pendingTriage) {
    ctx.decision = "answer_triage";
    return ctx;
  }

  // Problems
  if (finalIntent === "crackRepair") {
    ctx.decision = "problem_start";
    ctx.problemId = "crack";
    return ctx;
  }

  if (finalIntent === "peelingPaint") {
    ctx.decision = "problem_start";
    ctx.problemId = "peeling";
    return ctx;
  }

  // Existing flows
  if (finalIntent === "colourSuggestions") {
    ctx.decision = "colour_flow";
    return ctx;
  }

  if (finalIntent === "invoice") {
    ctx.decision = "invoice_flow";
    return ctx;
  }

  // Normal intent
  ctx.decision = "intent";

  return ctx;
}

 
