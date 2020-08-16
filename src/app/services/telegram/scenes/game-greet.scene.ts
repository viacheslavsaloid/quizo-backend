import { TelegramScene } from 'src/app/models/telegram/scenes.enum';

export async function gameGreetScene(ctx) {
  console.log(TelegramScene.GAME_GREET);

  ctx.state.user.telegram.scene = TelegramScene.GAME_GREET;

  const { game } = ctx.state.player;

  await ctx.state.sendMessage({ ctx, message: game.hi?.title });
  await ctx.state.sendMessage({ ctx, message: game.hi?.description });

  await ctx.state.sendMessage({ ctx, messageNumber: 3, markupNumber: 1 });

  const savePrevious = 1 + (game.hi?.title ? 1 : 0) + (game.hi?.description ? 1 : 0);

  await ctx.state.clearChat({ ctx, savePrevious });

  await ctx.scene.enter(TelegramScene.GAME_GREET_HANDLER, null, true); // name, defaultState, silence -> if true, does`t call enter method in scene

  ctx.state.user.telegram.scene = TelegramScene.GAME_GREET_HANDLER; // we have to change current scene here, because we didn`t enter in
}
