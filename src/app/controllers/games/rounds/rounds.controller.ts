import { Controller, UseGuards, Logger, Post, Param, Body, Get, Query } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, ParsedBody, CrudRequest } from '@nestjsx/crud';
import { RoundsService } from 'src/app/services/game';
import { Round } from 'src/db/entities/round';
import { JwtAuthGuard } from 'src/app/guards';
import { Public } from 'src/app/utils/decorators';

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
      game: {
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

  @Public()
  @Get('count')
  getCount(@Query() query) {
    return this.service.getCount(query);
  }

  @Override()
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Round) {
    const count = await this.service.getCount({ game: dto.game });
    return this.service.createOne(req, { ...dto, order: count + 1 });
  }

  @Post(':id/toogle')
  async start(@Param('id') id) {
    return this.service.toogleActiveRound(id);
  }

  @Post('sort')
  async sort(@Body() { data }) {
    return this.service.sort(data);
  }
}
