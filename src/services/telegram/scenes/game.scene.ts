import { sendMessage } from 'src/shared/helpers/telegram/send';
import { clearChat } from 'src/shared/helpers/telegram/chat';
import { SceneProps } from 'src/shared/models/telegram/scene.model';
import { AppContext } from 'src/shared/models/telegram/context.model';

async function showHintPreview(ctx: AppContext, repository) {
  await sendMessage({ ctx, repository, messageNumber: 9, markupNumber: 3 });
  ctx.session.isHintAvaliable = true;
}

async function startHintTimer(ctx: AppContext, repository) {
  const { hintTimeout } = ctx.session;

  if (hintTimeout) {
    clearTimeout(hintTimeout);
  }

  ctx.session.hintTimeout = setTimeout(() => showHintPreview(ctx, repository), 10000);
}

async function showHint(props) {
  const { ctx, repository } = props;
  const { game, roundOrder = 1, hintOrder = 0 } = ctx.session;

  const { hints } = game.rounds.find(x => x.order === roundOrder);

  await sendMessage({ ctx, message: hints[hintOrder], removeKeyboard: true, repository });

  const nextHint = hintOrder + 1;

  if (nextHint < hints.length) {
    ctx.session.hintOrder = nextHint;
    ctx.session.isHintAvaliable = false;
    startHintTimer(ctx, repository);
  }
}

export async function gameSceneEnter(props: SceneProps) {
  await clearChat(props);

  const { ctx, repository } = props;
  const { game, roundOrder = 1, questionOrder = 0 } = ctx.session;

  const { questions, hints } = game.rounds.find(x => x.order === roundOrder);
  const { title: message, correctAnswer, media } = questions[questionOrder];

  await sendMessage({ ctx, message, media, repository });

  if (hints.length) {
    startHintTimer(ctx, repository);
  }

  ctx.session.correctAnswer = correctAnswer;
  ctx.wizard.next();
}

export async function gameScene(props: SceneProps) {
  const { ctx, repository } = props;

  const { game, correctAnswer, roundOrder = 1, isHintAvaliable } = ctx.session;

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
    await sendMessage({ ctx, messageNumber: 5, repository });

    const nextRound = roundOrder + 1;

    if (nextRound <= game.rounds.length) {
      ctx.session.roundOrder = nextRound;
      ctx.scene.reenter();
    } else {
      await clearChat(props);

      if (game.bye) {
        await sendMessage({ ctx, message: game.bye.title, repository });
        await sendMessage({ ctx, message: game.bye.description, repository });
      }

      await sendMessage({ ctx, messageNumber: 10, markupNumber: 2, repository });

      ctx.scene.leave();
    }
  } else if (ctx.message.text === 'Подсказка') {
    if (isHintAvaliable) {
      await showHint(props);
    } else {
      await sendMessage({ ctx, messageNumber: 7, repository });
    }
  } else {
    await sendMessage({ ctx, messageNumber: 6, repository });
  }
}
