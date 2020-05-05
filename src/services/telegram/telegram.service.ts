import { Injectable } from '@nestjs/common';
import { InjectBot, Stage, TelegrafProvider, session, WizardScene } from 'nestjs-telegraf';
import { AuthService } from '../auth';
import { UserRepository } from 'src/db/repositories';
import { GameScene } from 'src/db/entities/player/game-scene';
import { GamesService } from '../game';
import { startSceneEnter } from './scenes/start.scene';
import { registrationSceneEnter, registrationSceneTokenHandler } from './scenes/registration.scene';
import { gameStartSceneEnter, gameStartScene } from './scenes/game-start.scene';
import { gameSceneEnter, gameScene } from './scenes/game.scene';

@Injectable()
export class TelegramService {
  constructor(
    @InjectBot() private readonly bot: TelegrafProvider,
    private authService: AuthService,
    private userRepository: UserRepository,
    private gamesService: GamesService
  ) {
    this.initScenes();
  }

  initScenes() {
    const start = new WizardScene(GameScene.START, ctx => startSceneEnter({ ctx, service: this.authService, repository: this.userRepository }));

    const registration = new WizardScene(
      GameScene.REGISTRATION,
      ctx => registrationSceneEnter({ ctx, repository: this.userRepository }),
      ctx => registrationSceneTokenHandler({ ctx, service: this.gamesService, repository: this.userRepository })
    );

    const gameStart = new WizardScene(
      GameScene.GAME_START,
      ctx => gameStartSceneEnter({ ctx, repository: this.userRepository }),
      ctx => gameStartScene({ ctx, repository: this.userRepository })
    );

    const game = new WizardScene(
      GameScene.GAME,
      ctx => gameSceneEnter({ ctx, repository: this.userRepository }),
      ctx => gameScene({ ctx, repository: this.userRepository })
    );

    const stage = new Stage([start, registration, gameStart, game], { default: GameScene.START });

    this.bot.use(session());
    this.bot.use(stage.middleware());
  }
}
