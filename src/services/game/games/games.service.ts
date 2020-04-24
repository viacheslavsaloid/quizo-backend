import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from 'src/db/entities/game';
import { GameUser, User } from 'src/db/entities';
import { GameUserRepository } from 'src/db/repositories';

@Injectable()
export class GamesService extends TypeOrmCrudService<Game> {
  private logger = new Logger('Game Service');

  constructor(
    @InjectRepository(Game) private repository: Repository<Game>,
    private gameUserRepository: GameUserRepository
  ) {
    super(repository);
  }
  public async setActiveRound(params) {
    const { id, game } = params;

    await this.repository.update({ id: game.id }, { activeRound: game.activeRound !== id ? id : '' });
    return { activeRound: id };
  }

  public async registerUser(params): Promise<User> {
    const { gameId, user } = params;

    const game = await this.repository.findOne(gameId);

    const gameUser = new GameUser();
    gameUser.game = game;
    gameUser.user = user;

    await gameUser.save();

    return user;
  }

  public async giveAccess(params) {
    const { gameId, user } = params;

    await this.gameUserRepository.update({ game: gameId, user: user.id }, { access: !user.access });

    return true;
  }
}
