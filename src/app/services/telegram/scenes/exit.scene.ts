import { TelegramScene } from 'src/app/models/telegram/scenes.enum';

export async function exithScene(ctx) {
  console.log(TelegramScene.EXIT);

  ctx.state.user.telegram.scene = TelegramScene.EXIT;

  const { game } = ctx.state.player;

  await ctx.state.sendMessage({ ctx, message: game.bye?.title });
  await ctx.state.sendMessage({ ctx, message: game.bye?.description });

  await ctx.state.sendMessage({ ctx, messageNumber: 9, markupNumber: 2 });

  ctx.state.player.history.push({
    action: 'exit_game',
    date: new Date(),
  });

  await ctx.scene.leave();
}
