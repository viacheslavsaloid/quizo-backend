import { Controller, Logger, Post, Body, Param, Get, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { User, Game } from 'src/db/entities';
import { GetRolesAccessesTo, GetUser } from 'src/shared/decorators';
import { Public } from 'src/shared/decorators/public.decorator';
import { JwtAuthGuard } from 'src/shared/guards';
import { ACGuard } from 'nest-access-control';
import { AccessControlInterceptor } from 'src/shared/interceptor';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';

const CONTROLLER_NAME = 'games';

const HasUserAccessTo = GetRolesAccessesTo(CONTROLLER_NAME);

const GamesAuth = {
  property: 'user',
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
      owner: {
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

@UseInterceptors(AccessControlInterceptor)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Crud(GamesCrudOptions)
@CrudAuth(GamesAuth)
@Controller(CONTROLLER_NAME)
export class GamesController implements CrudController<Game> {
  logger = new Logger('quests controller');

  constructor(public service: GamesService) {}
  get base(): CrudController<Game> {
    return this;
  }

  @Public()
  @HasUserAccessTo('read')
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Public()
  @HasUserAccessTo('read')
  @Override()
  async getOne(@ParsedRequest() req: CrudRequest) {
    const game = await this.base.getOneBase(req);
    const count = await this.service.getCount();
    return {
      game,
      count
    };
  }

  @HasUserAccessTo('create')
  @Override()
  createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Game) {
    return this.base.createOneBase(req, dto);
  }

  @HasUserAccessTo('create')
  @Override()
  createMany(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: CreateManyDto<Game>) {
    return this.base.createManyBase(req, dto);
  }

  @HasUserAccessTo('update')
  @Override()
  updateOneBase(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Game) {
    return this.base.updateOneBase(req, dto);
  }

  @HasUserAccessTo('update')
  @Override()
  replaceOneBase(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Game) {
    return this.base.replaceOneBase(req, dto);
  }

  @HasUserAccessTo('delete')
  @Override()
  deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }

  @HasUserAccessTo('update')
  @Post(':id/access')
  giveAccess(@Param('id') id, @Body() user) {
    return this.service.giveAccess({ gameId: id, user });
  }

  @HasUserAccessTo('read')
  @Public()
  @Get(':id/access')
  hasAccess(@Param('id') id, @GetUser() user) {
    return this.service.hasAccess({ gameId: id, user });
  }

  @HasUserAccessTo('create')
  @Post(':id/generate')
  generateToken(@Param('id') id) {
    return this.service.generateToken(id);
  }

  @Public()
  @Get('count')
  getCount() {
    return this.service.getCount();
  }
}
