import { Controller, UseGuards, Logger, Post, Body, Param } from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudAuth,
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto,
  CrudOptions
} from '@nestjsx/crud';
import { GamesService } from 'src/services/game';
import { JwtAuthGuard } from 'src/guards';
import { ACGuard } from 'nest-access-control';
import { User, UserRole, Game } from 'src/db/entities';
import { GetRolesAccessesTo, GetUser } from 'src/utils/decorators';

function filterGames(user: User) {
  return user.roles.includes(UserRole.COMPANY)
    ? {
        owner: user.id
      }
    : {
        ['players.user.id']: user.id,
        ['players.access']: true
      };
}

const CONTROLLER_NAME = 'games';

const HasAccessTo = GetRolesAccessesTo(CONTROLLER_NAME);

const GamesAuth = {
  property: 'user',
  filter: filterGames,
  persist: (user: User) => ({
    owner: user
  })
};

const GamesCrudOptions: CrudOptions = {
  model: {
    type: Game
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
      rounds: {
        eager: true
      },
      players: {
        eager: true
      },
      ['players.user']: {
        eager: true,
        allow: ['id', 'name']
      }
    },
    sort: [
      {
        field: 'rounds.order',
        order: 'ASC'
      }
    ]
  }
};

@UseGuards(ACGuard)
@UseGuards(JwtAuthGuard)
@Crud(GamesCrudOptions)
@CrudAuth(GamesAuth)
@Controller(CONTROLLER_NAME)
export class GamesController implements CrudController<Game> {
  logger = new Logger('quests controller');

  constructor(public service: GamesService) {}
  get base(): CrudController<Game> {
    return this;
  }

  @HasAccessTo('read')
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @HasAccessTo('read')
  @Override()
  getOneBase(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @HasAccessTo('create')
  @Override()
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Game) {
    return this.base.createOneBase(req, dto);
  }

  @HasAccessTo('create')
  @Override()
  createMany(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: CreateManyDto<Game>) {
    return this.base.createManyBase(req, dto);
  }

  @HasAccessTo('update')
  @Override()
  updateOneBase(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Game) {
    return this.base.updateOneBase(req, dto);
  }

  @HasAccessTo('update')
  @Override()
  replaceOneBase(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Game) {
    return this.base.replaceOneBase(req, dto);
  }

  @HasAccessTo('delete')
  @Override()
  deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }

  @HasAccessTo('update')
  @Post(':id/access')
  async check(@Param('id') id, @Body() body) {
    return this.service.giveAccess({ gameId: id, user: body });
  }
}
