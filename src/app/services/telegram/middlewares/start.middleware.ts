import { TelegramScene } from 'src/app/models/telegram/scenes.enum';

export function startHandler(ctx) {
  console.log('here');
  ctx.session = { messages: ctx.session.messages };
  ctx.scene.enter(TelegramScene.START);
}
