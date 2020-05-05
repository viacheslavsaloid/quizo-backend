import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User, UserRole } from 'src/db/entities/user';

export class UserDto {
  @ApiProperty({ required: false })
  telegramId?: number;

  @ApiProperty({ required: false })
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  password?: string;

  @ApiProperty({ required: false })
  token?: string;

  @ApiProperty({ required: false })
  scene?: number;

  roles?: [UserRole];

  static fromDatabase(data: User): Partial<User> {
    const fromDb = new User();
    fromDb.id = data.id;
    fromDb.name = data.name;
    fromDb.roles = data.roles;
    return fromDb;
  }
}
