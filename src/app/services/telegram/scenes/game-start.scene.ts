import { clearChat } from 'src/app/utils/telegram/chat';
import { SceneProps } from 'src/app/models/telegram/scene.model';
import { TelegramScene } from 'src/app/models/telegram/scenes.enum';

export async function gameStartSceneEnter(props: SceneProps) {
  const { ctx } = props;

  const game = ctx.session.game;

  if (game.hi) {
    await ctx.sendMessage({ ctx, message: game.hi.title });
    await ctx.sendMessage({ ctx, message: game.hi.description });
  }

  await ctx.sendMessage({ ctx, messageNumber: 4, markupNumber: 1 });

  const savePrevious = 1 + (game.hi ? (game.hi.title ? 1 : 0) + (game.hi.description ? 1 : 0) : 0);

  clearChat({ ...props, savePrevious });

  ctx.wizard.next();
}

export async function gameStartScene(props: SceneProps) {
  const { ctx } = props;

  ctx.scene.enter(TelegramScene.GAME);
}
