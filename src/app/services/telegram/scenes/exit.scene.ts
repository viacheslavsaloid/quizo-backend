import { TelegramScene } from 'src/app/models/telegram/scenes.enum';

export async function exithScene(ctx) {
  console.log(TelegramScene.EXIT);

  ctx.state.user.telegram.scene = TelegramScene.EXIT;

  const { game } = ctx.state;

  await ctx.state.sendMessage({ ctx, message: game.bye?.title });
  await ctx.state.sendMessage({ ctx, message: game.bye?.description });

  await ctx.state.sendMessage({ ctx, messageNumber: 9, markupNumber: 2 });

  const savePrevious = 1 + (game.bye?.title ? 1 : 0) + (game.bye?.description ? 1 : 0);

  await ctx.state.clearChat({ ctx, savePrevious });

  await ctx.scene.leave();
}
