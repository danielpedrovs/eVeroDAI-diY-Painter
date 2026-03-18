import { handlers } from "../../../handlers/handlers.js";
import { session } from "../../session.js";

export function responseNode(ctx) {

  if (ctx.response) return ctx.response;

  const handler = handlers[ctx.intent] || handlers.unknown;

  if (ctx.intent !== "unknown") {
    session.lastIntent = ctx.intent;
  }

  return handler(ctx.message);
}