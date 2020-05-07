import { GameScene } from 'src/db/entities/player/game-scene';
import { SceneProps } from 'src/app/shared/models/telegram/scene.model';

export async function registrationSceneEnter(props: SceneProps) {
  const { ctx } = props;
  await ctx.sendMessage({ ctx, messageNumber: 1 });
  return ctx.wizard.next();
}

export async function registrationScene(props: Partial<SceneProps>) {
  const { ctx, service } = props;

  const token = ctx.message.text;

  const verified = await service.verifyToken(token);

  if (verified) {
    const player = await service.useToken({ token, user: ctx.session.user });
    ctx.session.game = player.game;
    ctx.scene.enter(GameScene.GAME_START);
  } else {
    await ctx.sendMessage({ ctx, messageNumber: 3 });
  }
}
