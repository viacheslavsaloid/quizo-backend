import { sendMessage } from 'src/shared/helpers/telegram/send';
import { GameScene } from 'src/db/entities/player/game-scene';
import { clearChat } from 'src/shared/helpers/telegram/chat';
import { SceneProps } from 'src/shared/models/telegram/scene.model';

export async function gameStartSceneEnter(props: SceneProps) {
  await clearChat(props);

  const { ctx } = props;

  const game = ctx.session.game;

  if (game.hi) {
    await sendMessage({ ctx, message: game.hi.title });
    await sendMessage({ ctx, message: game.hi.description });
  }

  await sendMessage({ ctx, messageNumber: 4, markupNumber: 1 });

  ctx.wizard.next();
}

export async function gameStartScene(props: SceneProps) {
  const { ctx } = props;

  ctx.scene.enter(GameScene.GAME);
}
