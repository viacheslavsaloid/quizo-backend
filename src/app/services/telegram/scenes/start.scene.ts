/* eslint-disable @typescript-eslint/camelcase */
import { clearChat } from 'src/app/utils/telegram/chat';
import { GameScene } from 'src/db/entities/player/game-scene';
import { UserRole } from 'src/db/entities';
import { SceneProps } from 'src/app/models/telegram/scene.model';

export async function startSceneEnter(props: SceneProps) {
  const { ctx, service } = props;

  const { id: telegramId, first_name, last_name, username } = ctx.from;
  const name = username || `${first_name} ${last_name}`;

  let user = await service.getUser({ telegramId });

  if (!user) {
    user = await service.signUp({ telegramId, name }, UserRole.PLAYER);
  }

  ctx.session.user = user;

  await clearChat({ ...props, deleteCurrent: false });

  ctx.scene.enter(GameScene.REGISTRATION);
}
