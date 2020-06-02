import { Controller, UseGuards, Logger, Post, Param, Body } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, CrudRequest } from '@nestjsx/crud';
import { RoundsService } from 'src/app/services/game';
import { Round } from 'src/db/entities/round';
import { JwtAuthGuard } from 'src/app/guards';
import { DebugLogger } from 'src/app/utils/debug';

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

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    const res = await this.base.deleteOneBase(req);
    const rounds = await this.service.get();

    await this.service.sort(rounds);

    return res;
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
