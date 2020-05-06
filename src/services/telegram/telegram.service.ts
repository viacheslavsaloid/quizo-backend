import { Injectable } from '@nestjs/common';
import { InjectBot, Stage, TelegrafProvider, session, WizardScene } from 'nestjs-telegraf';
import { AuthService } from '../auth';
import { GameScene } from 'src/db/entities/player/game-scene';
import { GamesService } from '../game';
import { startSceneEnter } from './scenes/start.scene';
import { registrationSceneEnter, registrationSceneTokenHandler } from './scenes/registration.scene';
import { gameStartSceneEnter, gameStartScene } from './scenes/game-start.scene';
import { gameSceneEnter, gameScene } from './scenes/game.scene';
import { startMiddleware } from './middlewares/start.middleware';

@Injectable()
export class TelegramService {
  constructor(@InjectBot() private readonly bot: TelegrafProvider, private authService: AuthService, private gamesService: GamesService) {
    this.initScenes();
  }

  initScenes() {
    const start = new WizardScene(GameScene.START, ctx => startSceneEnter({ ctx, service: this.authService }));

    const registration = new WizardScene(
      GameScene.REGISTRATION,
      ctx => registrationSceneEnter({ ctx }),
      ctx => registrationSceneTokenHandler({ ctx, service: this.gamesService })
    );

    const gameStart = new WizardScene(
      GameScene.GAME_START,
      ctx => gameStartSceneEnter({ ctx }),
      ctx => gameStartScene({ ctx })
    );

    const game = new WizardScene(
      GameScene.GAME,
      ctx => gameSceneEnter({ ctx }),
      ctx => gameScene({ ctx })
    );

    const stage = new Stage([start, registration, gameStart, game], { default: GameScene.START });

    this.bot.use(session());

    // * For detect /start and ALWAYS move to GameScene.START
    // ! Must be after session init
    this.bot.use(startMiddleware);

    this.bot.use(stage.middleware());
  }
}
