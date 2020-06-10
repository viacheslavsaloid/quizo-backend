import { getSendMessageFunc, clearChat, nextRound } from 'src/app/utils/telegram';

export async function utilsMiddleware(ctx, next, authService, gamesService, telegramMediaRepository) {
  console.log('utilsMiddleware');

  ctx.session = {};

  ctx.state.sendMessage = getSendMessageFunc({ ctx, repository: telegramMediaRepository });
  ctx.state.clearChat = clearChat;
  ctx.state.nextRound = nextRound;

  ctx.state.authService = authService;
  ctx.state.gamesService = gamesService;
  ctx.state.telegramMediaRepository = telegramMediaRepository;

  next();
}
