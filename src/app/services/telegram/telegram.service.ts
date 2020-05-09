import { Injectable } from '@nestjs/common';
import { InjectBot, Stage, TelegrafProvider, session, WizardScene } from 'nestjs-telegraf';
import { AuthService } from '../auth';
import { GamesService } from '../game';
import { startSceneEnter } from './scenes/start.scene';
import { registrationSceneEnter, registrationScene } from './scenes/registration.scene';
import { gameStartSceneEnter, gameStartScene } from './scenes/game-start.scene';
import { gameSceneEnter, gameScene } from './scenes/game.scene';
import { startHandler } from './middlewares/start.middleware';
import { TelegramMediaRepository } from 'src/db/repositories';
import { sendMessageHandler } from './middlewares/sendMessage.middleware';
import { TelegramScene } from 'src/app/models/telegram/scenes.enum';

@Injectable()
export class TelegramService {
  constructor(
    @InjectBot() private readonly bot: TelegrafProvider,
    private authService: AuthService,
    private gamesService: GamesService,
    private telegramMediaRepository: TelegramMediaRepository
  ) {
    this.initMiddlewares();
    this.initScenes();
  }

  initMiddlewares() {
    this.bot.use((ctx, next) => sendMessageHandler({ ctx, next, repository: this.telegramMediaRepository }));
  }

  initScenes() {
    const start = new WizardScene(TelegramScene.START, ctx => startSceneEnter({ ctx, authService: this.authService }));

    const registration = new WizardScene(
      TelegramScene.REGISTRATION,
      ctx => registrationSceneEnter({ ctx }),
      ctx => registrationScene({ ctx, gamesService: this.gamesService })
    );

    const gameStart = new WizardScene(
      TelegramScene.GAME_START,
      ctx => gameStartSceneEnter({ ctx }),
      ctx => gameStartScene({ ctx })
    );

    const game = new WizardScene(
      TelegramScene.GAME,
      ctx => gameSceneEnter({ ctx }),
      ctx => gameScene({ ctx })
    );

    const stage = new Stage([start, registration, gameStart, game], { default: TelegramScene.START });

    this.bot.use(session());

    stage.hears('/start', startHandler);

    this.bot.use(stage.middleware());
  }
}
