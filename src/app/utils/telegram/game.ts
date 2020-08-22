import { TelegramScene } from 'src/app/models/telegram/scenes.enum';

export async function nextRound(ctx) {
  const { player, user } = ctx.state;
  const { roundOrder = 0 } = user.telegram;

  let nextScene;

  if (roundOrder < player.game.rounds.length) {
    ctx.state.user.telegram.roundOrder = roundOrder + 1; // next round
    ctx.state.user.telegram.hintOrder = 0; // reset hints
    ctx.state.user.telegram.lastHintDate = undefined; // reset hints
    nextScene = TelegramScene.GAME;
  } else {
    nextScene = TelegramScene.EXIT;
  }

  await ctx.scene.enter(nextScene);
}
