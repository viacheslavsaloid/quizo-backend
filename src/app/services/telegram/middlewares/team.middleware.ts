export async function teamMiddleware(ctx, next) {
  console.log('teamMiddleware');

  if (ctx.state.player) {
    ctx.state.player.team = ctx.state.player.team.filter((teamPlayer) => teamPlayer.user);
  }

  const { team, role = [] } = ctx.state.player || {};

  if (role.includes('leader') && team?.length) {

    team.forEach((teamPlayer) => {
      ctx.telegram.sendMessage(teamPlayer.user.telegramId, `${ctx.state.player.user.name}: ${ctx.message.text}`);
    });
  }

  next();
}
