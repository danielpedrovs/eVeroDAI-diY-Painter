
export function intentNode(ctx) {

  const top = ctx.scores?.[0];

  if (!top || top.score < 2) {
    ctx.intent = "unknown";
    return ctx;
  }

  ctx.intent = top.intent;

  return ctx;
}