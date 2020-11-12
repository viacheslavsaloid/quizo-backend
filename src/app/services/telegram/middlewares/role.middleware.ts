export async function roleMiddleware(ctx, next) {
  console.log('roleMiddleware');

  const { player } = ctx.state;

  if (player && player.role.includes('team')) {
    return ctx.state.sendMessage({ ctx, messageNumber: 12 });
  }

  next();
}
