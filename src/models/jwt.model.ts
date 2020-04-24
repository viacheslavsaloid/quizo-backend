import { UserRole } from 'src/db/entities/user';

export interface JwtPayload {
  id: string;
  name: string;
  roles: [UserRole];
}
