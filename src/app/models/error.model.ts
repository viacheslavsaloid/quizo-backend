import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AppError {
  @ApiProperty()
  @IsString()
  statusCode: string;

  @ApiProperty()
  @IsString()
  error: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsString()
  errors: string;

  @ApiProperty()
  @IsString()
  timestamp: string;

  @ApiProperty()
  @IsString()
  path: string;
}
