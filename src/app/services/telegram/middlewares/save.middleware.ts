export async function saveMiddleware(ctx, next) {
  console.log('saveMiddleware');

  await ctx.state.user.save();

  next();
}
