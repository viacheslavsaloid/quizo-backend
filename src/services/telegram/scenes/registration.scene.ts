import { sendMessage } from 'src/shared/helpers/telegram/send';
import { GameScene } from 'src/db/entities/player/game-scene';
import { SceneProps } from 'src/shared/models/telegram/scene.model';

export async function registrationSceneEnter(props: SceneProps) {
  const { ctx } = props;
  await sendMessage({ ctx, messageNumber: 1 });
  return ctx.wizard.next();
}

export async function registrationSceneTokenHandler(props: Partial<SceneProps>) {
  const { ctx, service } = props;

  const token = ctx.message.text;

  const verified = await service.verifyToken(token);

  if (verified) {
    const player = await service.useToken({ token, user: ctx.session.user });
    ctx.session.game = player.game;
    ctx.scene.enter(GameScene.GAME_START);
  } else {
    await sendMessage({ ctx, messageNumber: 3 });
  }
}
