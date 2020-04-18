import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserRole } from 'src/db/entities';

export class UserDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  password: string;

  role: UserRole;
}
