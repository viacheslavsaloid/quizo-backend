import { ApiProperty } from '@nestjs/swagger';

export class AppResponse<T> {
  @ApiProperty()
  data: T;
}
