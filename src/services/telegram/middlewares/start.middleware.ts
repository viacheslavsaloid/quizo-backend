export function startMiddleware(ctx, next) {
  ctx.session = ctx.message.text === '/start' ? { messages: ctx.session.messages } : { ...ctx.session };
  next();
}
