import { Controller, UseGuards, Logger, Param } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, ParsedBody, CrudRequest } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/shared';
import { Round } from 'src/db/entities';
import { RoundsService } from 'src/game/services';
import { GameRepository, RoundDto } from 'src/db';

@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Round
  }
})
@Controller('rounds')
export class RoundsController implements CrudController<Round> {
  private logger = new Logger('Quest Rounds Controller');

  constructor(public service: RoundsService, public gameRepository: GameRepository) {}

  get base(): CrudController<Round> {
    return this;
  }

  @Override()
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: RoundDto, @Param('questId') questId: string) {
    const game = await this.gameRepository.findOne(questId);
    return this.base.createOneBase(req, RoundDto.toDatabase(dto, game));
  }
}
