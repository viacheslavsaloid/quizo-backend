import { TelegramScene } from 'src/app/models/telegram/scenes.enum';

export async function stateMiddleware(ctx, next) {
  console.log('stateMiddleware');

  const { scene = TelegramScene.REGISTRATION } = ctx.state.user.telegram;

  await ctx.scene.enter(scene);

  next();
}
