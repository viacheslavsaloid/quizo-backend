import { WizardScene, Stage } from 'nestjs-telegraf';
import { TelegramScene } from 'src/app/models/telegram/scenes.enum';
import {
  registrationScene,
  registrationHandlerScene,
  gameGreetScene,
  gameGreetHandlerScene,
  gameScene,
  gameHandlerScene,
  exithScene
} from '../scenes';

export async function scenesMiddleware(ctx, next) {
  console.log('scenesMiddleware');

  const registration = new WizardScene(TelegramScene.REGISTRATION, registrationScene);
  const registrationHandler = new WizardScene(TelegramScene.REGISTRATION_HANDLER, registrationHandlerScene);
  const gameGreet = new WizardScene(TelegramScene.GAME_GREET, gameGreetScene);
  const gameGreetHandler = new WizardScene(TelegramScene.GAME_GREET_HANDLER, gameGreetHandlerScene);
  const game = new WizardScene(TelegramScene.GAME, gameScene);
  const gameHandler = new WizardScene(TelegramScene.GAME_HANDLER, gameHandlerScene);
  const exit = new WizardScene(TelegramScene.EXIT, exithScene);

  const stage = new Stage([registration, registrationHandler, gameGreet, gameGreetHandler, game, gameHandler, exit]);

  await stage.middleware()(ctx, next);
}
