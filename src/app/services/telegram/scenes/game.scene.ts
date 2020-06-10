import { TelegramScene } from 'src/app/models/telegram/scenes.enum';

export async function gameScene(ctx) {
  console.log(TelegramScene.GAME);

  ctx.state.user.telegram.scene = TelegramScene.GAME;

  const { game, user } = ctx.state;
  const { roundOrder = 0 } = user.telegram;

  if (!game.rounds) {
    return ctx.state.sendMessage({ ctx, messageNumber: 10, markupNumber: 2 });
  }

  const round = game.rounds.find(x => x.order === roundOrder);

  if (!round?.questions?.length || !round?.active) {
    return ctx.state.nextRound(ctx);
  }

  let savePrevious = 0;

  for (const question of round.questions) {
    const { title: message, medias } = question;

    await ctx.state.sendMessage({ ctx, message, medias });

    savePrevious += (message ? 1 : 0) + medias?.length;
  }

  await ctx.state.clearChat({ ctx, savePrevious });

  await ctx.scene.enter(TelegramScene.GAME_HANDLER, null, true); // name, defaultState, silence -> if true, does`t call enter method in scene

  ctx.state.user.telegram.scene = TelegramScene.GAME_HANDLER; // we have to change current scene here, because we didn`t enter in
}
