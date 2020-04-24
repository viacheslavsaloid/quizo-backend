import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User, UserRole } from 'src/db/entities/user';

export class UserDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  password: string;

  roles: [UserRole];

  static fromDatabase(data: User): Partial<User> {
    const fromDb = new User();
    fromDb.id = data.id;
    fromDb.name = data.name;
    fromDb.roles = data.roles;
    return fromDb;
  }
}
