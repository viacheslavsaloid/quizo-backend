import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Game } from 'src/db/entities';
import { Round } from 'src/db/entities/round';

export class RoundDto implements Readonly<RoundDto> {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  logo: string;

  static toDatabase(data: RoundDto, game: Game): Round {
    const toDb = new Round();
    if (data.id) {
      toDb.id = data.id;
    }
    toDb.name = data.name;
    toDb.game = game;
    return toDb;
  }
}
