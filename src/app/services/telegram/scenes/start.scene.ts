/* eslint-disable @typescript-eslint/camelcase */
import { clearChat } from 'src/app/utils/telegram/chat';
import { UserRole } from 'src/db/entities';
import { SceneProps } from 'src/app/models/telegram/scene.model';
import { TelegramScene } from 'src/app/models/telegram/scenes.enum';

export async function startSceneEnter(props: SceneProps) {
  const { ctx, authService } = props;

  const { id: telegramId, first_name, last_name, username } = ctx.from;
  const name = username || `${first_name} ${last_name}`;

  let user = await authService.getUser({ telegramId });

  if (!user) {
    user = await authService.signUp({ dto: { telegramId, name }, role: UserRole.PLAYER });
  }

  ctx.session.user = user;

  await clearChat({ ...props, deleteCurrent: false });

  ctx.scene.enter(TelegramScene.REGISTRATION);
}
