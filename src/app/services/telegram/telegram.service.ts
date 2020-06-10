import { Injectable } from '@nestjs/common';
import { InjectBot, TelegrafProvider, session } from 'nestjs-telegraf';
import { AuthService } from '../auth';
import { GamesService } from '../game';
import { TelegramMediaRepository } from 'src/db/repositories';
import { utilsMiddleware, authMiddleware, scenesMiddleware, saveMiddleware, gameMiddleware } from './middlewares';
import { startHear } from './hears';
import { stateMiddleware } from './middlewares/state.middleware';

@Injectable()
export class TelegramService {
  constructor(
    @InjectBot() private readonly bot: TelegrafProvider,
    private authService: AuthService,
    private gamesService: GamesService,
    private telegramMediaRepository: TelegramMediaRepository
  ) {
    this.bot.use(session()); // for scenes

    this.bot.use((ctx, next) => utilsMiddleware(ctx, next, this.authService, this.gamesService, this.telegramMediaRepository));

    this.bot.use(authMiddleware);

    this.bot.hears('/start', startHear);

    this.bot.use(gameMiddleware);

    this.bot.use(scenesMiddleware);

    this.bot.use(stateMiddleware);

    this.bot.use(saveMiddleware);
  }
}
