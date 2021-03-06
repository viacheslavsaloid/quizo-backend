export async function gameMiddleware(ctx, next) {
  console.log('gameMiddleware');

  const { gamesService, user } = ctx.state;

  if (user.telegram.playerId) {
    ctx.state.player = await gamesService.getPlayer(user.telegram.playerId, { relations: [
        'game',
        'game.rounds',
        'game.rounds.questions',
        'team',
        'team.user',
        'user'
      ]
    });
  }

  next();
}
