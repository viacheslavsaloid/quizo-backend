import { UserRole } from 'src/db/entities';

export async function authMiddleware(ctx, next) {
  console.log('authMiddleware');

  const { id: telegramId, first_name, last_name, username } = ctx.from;
  const { authService } = ctx.state;

  let user = await authService.getUser({ telegramId });

  if (!user) {
    const name = username || first_name + ' ' + last_name;
    user = await authService.signUp({ dto: { telegramId, name }, role: UserRole.PLAYER });
  }

  ctx.state.user = user;

  next();
}
