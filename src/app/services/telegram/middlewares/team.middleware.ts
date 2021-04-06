export async function teamMiddleware(ctx, next) {
  console.log('teamMiddleware');

  const { team, role = [] } = ctx.state.player || {};

  console.log('team', team)

  if (role.includes('leader') && team?.length) {

    team.filter((teamPlayer) => teamPlayer.user).forEach((teamPlayer) => {
      ctx.telegram.sendMessage(teamPlayer.user.telegramId, `${ctx.state.player.user.name}: ${ctx.message.text}`);
    });
  }

  next();
}
