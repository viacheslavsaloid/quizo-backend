import { sendMessage } from 'src/shared/helpers/telegram/send';
import { GameScene } from 'src/db/entities/player/game-scene';
import { clearChat } from 'src/shared/helpers/telegram/chat';
import { SceneProps } from 'src/shared/models/telegram/scene.model';

export async function gameStartSceneEnter(props: SceneProps) {
  await clearChat(props);

  const { ctx, repository } = props;

  const game = ctx.session.game;

  if (game.hi) {
    await sendMessage({ ctx, message: game.hi.title, repository });
    await sendMessage({ ctx, message: game.hi.description, repository });
  }

  await sendMessage({ ctx, messageNumber: 4, markupNumber: 1, repository });

  ctx.wizard.next();
}

export async function gameStartScene(props: SceneProps) {
  const { ctx } = props;

  if (ctx.message.text === 'Начать Игру') {
    ctx.scene.enter(GameScene.GAME);
  } else {
    ctx.deleteMessage();
  }
}
