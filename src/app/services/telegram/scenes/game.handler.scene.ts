import { TelegramScene } from 'src/app/models/telegram/scenes.enum';
import { parseString } from 'src/app/utils/telegram';
import { TELEGRAM_CHECK, TELEGRAM_MESSAGES } from 'src/assets';

import * as moment from 'moment';

async function sendWrong(ctx, wrongs) {
  const message = wrongs[Math.floor(Math.random() * wrongs.length)];
  await ctx.state.sendMessage({ ctx, message, messageNumber: 5 });
}

async function sendHint(ctx, hints, roundOrder, hintOrder, lastHintDate) {
  const waitSec = 120;

  const startDate = moment(lastHintDate);
  const endDate = moment();

  const diffSec = endDate.diff(startDate, 'seconds');

  if (!lastHintDate || diffSec >= waitSec) {
    ctx.state.player.history.push({
      action: 'hint',
      date: new Date(),
      description: `Round ${roundOrder}. Hint: ${hintOrder}`
    });
    const message = hints[hintOrder];
    await ctx.state.sendMessage({ ctx, message, messageNumber: 7 });
    ctx.state.user.telegram.hintOrder = hintOrder + 1;
    ctx.state.user.telegram.lastHintDate = new Date();
  } else {
    const left = waitSec - diffSec;

    const leftMin = Math.trunc(left / 60).toString();
    const leftSec = (left % 60).toString();

    const message = TELEGRAM_MESSAGES[6].replace(':min', leftMin).replace(':sec', leftSec);

    await ctx.state.sendMessage({ ctx, message });
  }
}

async function sendCorrect(ctx) {
  await ctx.state.sendMessage({ ctx, messageNumber: 4 });
  await ctx.state.nextRound(ctx);
}

export async function gameHandlerScene(ctx) {
  console.log(TelegramScene.GAME_HANDLER);

  const { player, user } = ctx.state;
  const { wrongs = [], rounds } = player.game;
  const { roundOrder = 0, hintOrder = 0, lastHintDate } = user.telegram;

  const { hints, correctAnswer } = rounds.find(x => x.order === roundOrder);

  const correctAnswers = parseString(correctAnswer).split(',');
  const answer = parseString(ctx.message.text);

  if (correctAnswers.includes(answer)) {
    ctx.state.player.history.push({
      action: 'correct_answer',
      date: new Date(),
      description: `Round ${roundOrder}. Correct Answer: ${answer}`
    });
    await sendCorrect(ctx);
  } else if (answer === TELEGRAM_CHECK[0]) {
    await sendHint(ctx, hints, roundOrder, hintOrder, lastHintDate);
  } else {
    ctx.state.player.history.push({
      action: 'wrong_answer',
      date: new Date(),
      description: `Round ${roundOrder}. Wrong Answer: ${answer}`
    });
    await sendWrong(ctx, wrongs);
  }
}
