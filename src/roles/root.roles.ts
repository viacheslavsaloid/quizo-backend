import { RolesBuilder } from 'nest-access-control';
import { UserRole } from 'src/db/entities/user';

export const ROOT_ROLES: RolesBuilder = new RolesBuilder();

ROOT_ROLES.grant(UserRole.PLAYER) // define new or modify existing role. also takes an array.
  .readAny('games')
  .grant(UserRole.COMPANY) // switch to another role without breaking the chain
  .extend(UserRole.PLAYER) // inherit role capabilities. also takes an array
  .createOwn('games')
  .updateOwn('games')
  .deleteOwn('games');
