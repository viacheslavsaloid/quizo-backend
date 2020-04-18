import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Game, User } from 'src/db/entities';

export class GameDto implements Readonly<GameDto> {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  static toDatabase(data: GameDto, user: User): Game {
    const toDb = new Game();
    if (data.id) {
      toDb.id = data.id;
    }
    toDb.name = data.name;
    toDb.user = user;
    return toDb;
  }
}
