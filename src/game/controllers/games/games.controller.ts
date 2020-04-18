import { Controller, UseGuards, Logger } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, ParsedBody, CrudRequest, CrudAuth } from '@nestjsx/crud';
import { GetUser, JwtAuthGuard } from 'src/shared';
import { Game, User, GameDto } from 'src/db';
import { GamesService } from 'src/game/services';

@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Game
  }
})
@CrudAuth({
  property: 'user',
  filter: (company: User) => ({
    company: company.id
  })
})
@Controller('games')
export class GamesController implements CrudController<GameDto> {
  logger = new Logger('quests controller');

  constructor(public service: GamesService) {}

  get base(): CrudController<GameDto> {
    return this;
  }

  @Override()
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: GameDto, @GetUser() user: User) {
    return this.base.createOneBase(req, GameDto.toDatabase(dto, user));
  }
}
