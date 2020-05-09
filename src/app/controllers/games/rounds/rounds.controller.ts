import { Controller, UseGuards, Logger, Post, Param, Body } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { RoundsService } from 'src/app/services/game';
import { Round } from 'src/db/entities/round';
import { JwtAuthGuard } from 'src/app/guards';

@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Round
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
      questions: {
        eager: true
      }
    }
  }
})
@Controller('rounds')
export class RoundsController implements CrudController<Round> {
  constructor(public service: RoundsService) {}

  get base(): CrudController<Round> {
    return this;
  }

  @Post(':id/toogle')
  async start(@Param('id') id) {
    return this.service.toogleActiveRound(id);
  }

  @Post('sort')
  async sort(@Body() data: { rounds: Round[] }) {
    return this.service.sort(data.rounds);
  }
}
