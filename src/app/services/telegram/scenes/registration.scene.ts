import { SceneProps } from 'src/app/models/telegram/scene.model';
import { TelegramScene } from 'src/app/models/telegram/scenes.enum';

export async function registrationSceneEnter(props: SceneProps) {
  const { ctx } = props;
  await ctx.sendMessage({ ctx, messageNumber: 1 });
  return ctx.wizard.next();
}

export async function registrationScene(props: Partial<SceneProps>) {
  const { ctx, gamesService } = props;

  const playerId = ctx.message.text;
  const userId = ctx.session.user.id;

  const verified = await gamesService.isPlayerVerified({ playerId, userId });

  if (verified) {
    const player = await gamesService.getPlayer(playerId, { relations: ['game', 'game.rounds', 'game.rounds.questions'] });
    const gameId = player.game.id;

    const isRegistered = await gamesService.registerToGame({ playerId, userId, gameId });

    if (isRegistered) {
      ctx.session.game = player.game;
      ctx.scene.enter(TelegramScene.GAME_START);
    }
  } else {
    await ctx.sendMessage({ ctx, messageNumber: 3 });
  }
}
