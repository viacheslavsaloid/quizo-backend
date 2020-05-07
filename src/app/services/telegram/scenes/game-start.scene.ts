import { GameScene } from 'src/db/entities/player/game-scene';
import { clearChat } from 'src/app/shared/helpers/telegram/chat';
import { SceneProps } from 'src/app/shared/models/telegram/scene.model';

export async function gameStartSceneEnter(props: SceneProps) {
  await clearChat(props);

  const { ctx } = props;

  const game = ctx.session.game;

  if (game.hi) {
    await ctx.sendMessage({ ctx, message: game.hi.title });
    await ctx.sendMessage({ ctx, message: game.hi.description });
  }

  await ctx.sendMessage({ ctx, messageNumber: 4, markupNumber: 1 });

  ctx.wizard.next();
}

export async function gameStartScene(props: SceneProps) {
  const { ctx } = props;

  ctx.scene.enter(GameScene.GAME);
}
