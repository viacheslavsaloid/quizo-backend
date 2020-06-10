import { TelegramScene } from 'src/app/models/telegram/scenes.enum';

export async function registrationScene(ctx) {
  console.log(TelegramScene.REGISTRATION);

  ctx.state.user.telegram.scene = TelegramScene.REGISTRATION;

  await ctx.state.sendMessage({ ctx, messageNumber: 0 });

  await ctx.scene.enter(TelegramScene.REGISTRATION_HANDLER, null, true); // name, defaultState, silence -> if true, does`t call enter method in scene

  ctx.state.user.telegram.scene = TelegramScene.REGISTRATION_HANDLER; // we have to change current scene here, because we didn`t enter in
}
