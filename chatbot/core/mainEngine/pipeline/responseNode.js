import { handlers } from "../../../handlers/handlers.js";
import { session } from "../../session.js";
import {
  startProblem,
  answerTriage,
  followUp
} from "../../../data/content/problemAnswer.js";

export function responseNode(ctx) {

  if (ctx.response) {
    return ctx.response;
  }

  // Waiting for an answer to a problem question
  if (ctx.decision === "answer_triage") {
    return answerTriage(ctx.message, session);
  }

  // Starting a problem conversation
  if (ctx.decision === "problem_start") {
    return startProblem(ctx.problemId, session);
  }

  // Follow-up about previous problem
  if (ctx.decision === "problem_followup") {
    const result = followUp(ctx.message, session);

    if (result) {
      return result;
    }
  }

  // Normal intent → handler
  const handler =
    handlers[ctx.intent] || handlers.unknown;

  if (ctx.intent !== "unknown") {
    session.lastIntent = ctx.intent;
  }

  return handler(ctx.message);
}