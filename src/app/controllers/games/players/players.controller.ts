import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/app/guards';
import { Player } from 'src/db/entities/player';
import { PlayersService } from 'src/app/services/game/players/players.service';

@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Player
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true
    }
  },
  query: {
    join: {
      user: {
        eager: true
      },
    }
  }
})
@Controller('players')
export class PlayersController implements CrudController<Player> {
  constructor(public service: PlayersService) {}
}
