import { Controller, UseGuards, Logger, Post, Param, Body } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { RoundsService } from 'src/services/game';
import { JwtAuthGuard } from 'src/shared/guards';
import { Round } from 'src/db/entities/round';

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
  private logger = new Logger('Quest Rounds Controller');

  constructor(public service: RoundsService) {}

  get base(): CrudController<Round> {
    return this;
  }

  @Post(':id/toogle')
  async start(@Param('id') id) {
    return this.service.setActiveRound(id);
  }

  @Post('sort')
  async sort(@Body() rounds: Round[]) {
    return this.service.sort(rounds);
  }
}
