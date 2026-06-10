import { extractDimensions } from "../../../domain/parser.js";
import { session } from "../../session.js";

export function extractNode(ctx) {

  const dims = extractDimensions(ctx.message);

  if (dims) {
    ctx.data.dimensions = dims;
    session.dimensions = dims;
  }

  ctx.data.hasDimensions = /\d+(\.\d+)?\s*(x|by)?\s*\d+/.test(ctx.message);

  return ctx;
}