export async function startHear(ctx, next) {
  console.log('startHear');

  await ctx.state.clearChat({ ctx, deleteCurrent: false });

  ctx.session = {};
  ctx.state.user.telegram = {};

  next();
}
