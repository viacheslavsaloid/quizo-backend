import { TelegramScene } from 'src/app/models/telegram/scenes.enum';

export async function registrationHandlerScene(ctx, next) {
  console.log(TelegramScene.REGISTRATION_HANDLER);

  const { gamesService, user } = ctx.state;

  const { text: playerId } = ctx.message; // text = token = playerId
  const { id: userId } = user;

  const verified = await gamesService.isPlayerVerified({ playerId, userId });

  if (verified) {
    const player = await gamesService.getPlayer(playerId, { relations: ['game', 'game.rounds', 'game.rounds.questions'] });

    const isRegistered = await gamesService.registerToGame({ playerId, userId, gameId: player.game.id });

    if (isRegistered) {
      ctx.state.user.telegram.playerId = playerId;
      ctx.state.player = player;
      ctx.state.player.history.push({
        action: 'registration',
        date: new Date()
      });
      await ctx.scene.enter(TelegramScene.GAME_GREET);
    }
  } else {
    await ctx.state.sendMessage({ ctx, messageNumber: 2 });
  }
}
