import { UserDto } from 'src/app/dto';
import { UserRole } from 'src/db/entities';

export interface SignUpProps {
  dto: UserDto;
  role: UserRole;
}
