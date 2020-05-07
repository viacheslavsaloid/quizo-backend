import { RolesBuilder } from 'nest-access-control';
import { UserRole } from 'src/db/entities/user';

export const ROOT_ROLES: RolesBuilder = new RolesBuilder();

ROOT_ROLES.grant(UserRole.NOT_REGISTERED)
  .readAny('games', [
    'count',
    'game.id',
    'game.name',
    'game.background',
    'game.logo',
    'game.preview',
    'game.private',
    'id',
    'name',
    'background',
    'logo',
    'preview',
    'private',
    'type',
    'players'
  ])
  .grant(UserRole.PLAYER)
  .extend(UserRole.NOT_REGISTERED)
  .readAny('games', ['access', 'rounds'])
  .grant(UserRole.COMPANY)
  .extend(UserRole.PLAYER)
  .createOwn('games')
  .updateOwn('games')
  .deleteOwn('games');
