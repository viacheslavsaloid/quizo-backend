import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserRole } from 'src/db/entities/user';

export class UserDto {
  @ApiProperty({ required: false })
  telegramId?: number;

  @ApiProperty({ required: false })
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  password?: string;

  roles?: [UserRole];
}
