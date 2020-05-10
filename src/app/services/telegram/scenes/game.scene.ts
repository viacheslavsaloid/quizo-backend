import { clearChat } from 'src/app/utils/telegram/chat';
import { SceneProps } from 'src/app/models/telegram/scene.model';
import { AppContext } from 'src/app/models/telegram/context.model';

async function showHintPreview(ctx: AppContext) {
  await ctx.sendMessage({ ctx, messageNumber: 9, markupNumber: 3 });
  ctx.session.isHintAvaliable = true;
}

async function startHintTimer(ctx: AppContext) {
  const { hintTimeout } = ctx.session;

  if (hintTimeout) {
    clearTimeout(hintTimeout);
  }

  ctx.session.hintTimeout = setTimeout(() => showHintPreview(ctx), 10000);
}

async function showHint(props) {
  const { ctx } = props;
  const { game, roundOrder = 1, hintOrder = 0 } = ctx.session;

  const { hints } = game.rounds.find(x => x.order === roundOrder);

  await ctx.sendMessage({ ctx, message: hints[hintOrder], removeKeyboard: true });

  const nextHint = hintOrder + 1;

  if (nextHint < hints.length) {
    ctx.session.hintOrder = nextHint;
    ctx.session.isHintAvaliable = false;
    startHintTimer(ctx);
  }
}

export async function gameSceneEnter(props: SceneProps) {
  const { ctx } = props;
  const { game, roundOrder = 1, questionOrder = 0 } = ctx.session;

  if (!game.rounds) return ctx.sendMessage({ ctx, messageNumber: 12, markupNumber: 2 });

  const { questions, hints } = game.rounds.find(x => x.order === roundOrder);

  if (!questions.length) return ctx.sendMessage({ ctx, messageNumber: 13, markupNumber: 2 });

  const { title, correctAnswer, medias = [] } = questions[questionOrder];

  await ctx.sendMessage({ ctx, message: title, medias });

  const savePrevious = (title ? 1 : 0) + medias.length;

  await clearChat({ ...props, savePrevious });

  if (hints && hints.length) {
    startHintTimer(ctx);
  }

  ctx.session.correctAnswer = correctAnswer;
  ctx.wizard.next();
}

export async function gameScene(props: SceneProps) {
  const { ctx } = props;

  const { game, correctAnswer, roundOrder = 1, isHintAvaliable, hintTimeout } = ctx.session;

  const correctAnswers = correctAnswer
    .split(' ')
    .join('')
    .toLowerCase()
    .split(',');

  const answer = ctx.message.text
    .split(' ')
    .join('')
    .toLowerCase();

  if (correctAnswers.includes(answer)) {
    await ctx.sendMessage({ ctx, messageNumber: 5 });

    const nextRound = roundOrder + 1;

    if (nextRound <= game.rounds.length) {
      ctx.session.roundOrder = nextRound;
      ctx.scene.reenter();
    } else {
      if (game.bye) {
        await ctx.sendMessage({ ctx, message: game.bye.title });
        await ctx.sendMessage({ ctx, message: game.bye.description });
      }

      await ctx.sendMessage({ ctx, messageNumber: 10, markupNumber: 2 });

      const savePrevious = 1 + (game.bye ? (game.bye.title ? 1 : 0) + (game.bye.description ? 1 : 0) : 0);

      await clearChat({ ...props, savePrevious });

      if (hintTimeout) {
        clearTimeout(hintTimeout);
      }

      ctx.scene.leave();
    }
  } else if (ctx.message.text === 'Подсказка') {
    if (isHintAvaliable) {
      await showHint(props);
    } else {
      await ctx.sendMessage({ ctx, messageNumber: 7 });
    }
  } else {
    const wrongs = game.wrongs || [];

    const message = wrongs[Math.floor(Math.random() * wrongs.length)];
    await ctx.sendMessage({ ctx, message, messageNumber: 6 });
  }
}
