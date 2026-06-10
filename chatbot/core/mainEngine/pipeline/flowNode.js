import { session } from "../../session.js";
import { handlers } from "../../../handlers/handlers.js";

export function flowNode(ctx) {

  const message = ctx.message;

  // 🔥 HARD FLOW LOCK
  if (session.activeFlow === "colour") {

    const exitFlow =
      message.includes("cancel") ||
      message.includes("stop");

    if (!exitFlow) {
      return handlers.colour_suggestion(message);
    }

    session.activeFlow = null;
  }

  // 🎨 START FLOW
  if (
    !session.activeFlow &&
    (message.includes("colour") || message.includes("color") || message.includes("paint idea"))
  ) {
    session.activeFlow = "colour";
    return handlers.colour_suggestion(message);
  }

  // 👍 YES / NO
  const isYes = ["yes", "yeah", "yep"].includes(message);
  const isNo = ["no", "nope"].includes(message);

  if (isYes || isNo) {
    if (session.lastIntent === "paintQuantity") {
      session.includeCeiling = isYes;
      return handlers.paintQuantity(message);
    }
  }

  return null;
}