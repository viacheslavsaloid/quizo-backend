import { TelegramScene } from 'src/app/models/telegram/scenes.enum';

export async function gameGreetHandlerScene(ctx) {
  console.log(TelegramScene.GAME_GREET_HANDLER);

  if (ctx.message.text === 'Начать Игру') {
    ctx.state.player.history.push({
      action: 'start_game',
      date: new Date()
    });
    await ctx.scene.enter(TelegramScene.GAME);
  } else {
    await ctx.state.sendMessage({ ctx, messageNumber: 3 });
  }
}
