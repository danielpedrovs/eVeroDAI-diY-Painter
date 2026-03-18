export function normalize(ctx) {
  ctx.message = ctx.message.toLowerCase().trim();
  return ctx;
}