import { TelegramScene } from 'src/app/models/telegram/scenes.enum';
import { parseString } from '../../../utils/telegram';

export async function gameGreetHandlerScene(ctx) {
  console.log(TelegramScene.GAME_GREET_HANDLER);
  
  const { game } = ctx.state.player;

  const correctAnswers = parseString('Начать Игру, Start Game').split(',');
  const answer = parseString(ctx.message.text);

  if (correctAnswers.includes(answer)) {
    ctx.state.player.history.push({
      action: 'start_game',
      date: new Date()
    });
    await ctx.scene.enter(TelegramScene.GAME);
  } else {
    await ctx.state.sendMessage({ ctx, message: game.hi?.title });
    await ctx.state.sendMessage({ ctx, message: game.hi?.description });
  }
}
