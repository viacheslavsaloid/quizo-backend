import { Controller, Post, Body, Param, Get, UseGuards, UseInterceptors, Patch, Query } from '@nestjs/common';
import { Crud, CrudController, CrudAuth, Override, ParsedRequest, CrudRequest, ParsedBody, CreateManyDto, CrudOptions } from '@nestjsx/crud';
import { GamesService } from 'src/app/services/game';
import { User, Game } from 'src/db/entities';
import { GetRolesAccessesTo, GetUser } from 'src/app/utils/decorators';
import { Public } from 'src/app/utils/decorators/public.decorator';
import { JwtAuthGuard } from 'src/app/guards';
import { PermissionsGuard } from 'src/app/guards/permissions.guard';
import { AccessControlInterceptor } from 'src/app/interceptors';

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
      owner: {
        eager: true
      },
      players: {
        eager: true,
      },
      'players.user': {
        eager: true
      }
    }
  }
};

@UseInterceptors(AccessControlInterceptor)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Crud(GamesCrudOptions)
@CrudAuth(GamesAuth)
@Controller(CONTROLLER_NAME)
export class GamesController implements CrudController<Game> {
  constructor(public service: GamesService) {}
  get base(): CrudController<Game> {
    return this;
  }

  @Public()
  @Get('count')
  getCount(@Query() query) {
    return this.service.getCount(query);
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
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
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
  updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Game) {
    return this.base.updateOneBase(req, dto);
  }

  @HasUserAccessTo('update')
  @Override()
  replaceOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Game) {
    return this.base.replaceOneBase(req, dto);
  }

  @HasUserAccessTo('delete')
  @Override()
  deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }

  @Post(':id/signup')
  signUp(@Param('id') gameId, @GetUser() user, @Body() body) {
    const { token: playerId } = body;
    const { id: userId } = user;
    return this.service.registerToGame({ gameId, userId, playerId });
  }

  @HasUserAccessTo('update')
  @Patch(':id/access')
  toogleAccess(@Body() body) {
    const { id: playerId } = body;
    return this.service.toogleAccess({ playerId });
  }

  @HasUserAccessTo('create')
  @Post(':id/generate')
  generateGameToken(@Param('id') gameId) {
    return this.service.generateGameToken({ gameId });
  }

  @Public()
  @HasUserAccessTo('read')
  @Get(':id/access')
  hasAccess(@Param('id') gameId, @GetUser() user) {
    const { id: userId } = user;
    return this.service.hasAccess({ userId, gameId });
  }
}
