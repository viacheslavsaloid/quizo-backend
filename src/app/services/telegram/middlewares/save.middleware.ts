export async function saveMiddleware(ctx, next) {
  console.log('saveMiddleware');

  await ctx.state.user.save();
  if (ctx.state.player) {
    await ctx.state.player.save();
  }

  next();
}
