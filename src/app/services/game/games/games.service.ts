import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from 'src/db/entities/game';
import { Player, User } from 'src/db/entities';
import { PlayerRepository } from 'src/db/repositories';
@Injectable()
export class GamesService extends TypeOrmCrudService<Game> {
  private logger = new Logger('Game Service');

  constructor(@InjectRepository(Game) private repository: Repository<Game>, private playerRepository: PlayerRepository) {
    super(repository);
  }

  public async setActiveRound(params) {
    const { id, game } = params;

    await this.repository.update({ id: game.id }, { activeRound: game.activeRound !== id ? id : '' });
    return { activeRound: id };
  }

  public async registerUser(params): Promise<User> {
    try {
      const { gameId, user } = params;

      const game = await this.repository.findOne(gameId);

      const player = new Player();
      player.game = game;
      player.user = user;

      await player.save();

      this.giveAccess({ gameId, user });

      return user;
    } catch (err) {
      return err;
    }
  }

  public async giveAccess(params) {
    const { gameId, user } = params;

    await this.playerRepository.update({ game: gameId, user: user.id }, { access: !user.access });

    return { access: !user.access };
  }

  public async hasAccess(params) {
    const { gameId, user } = params;

    return this.playerRepository.findOne({ game: gameId, user: user.id });
  }

  public async generateToken(gameId) {
    const player = new Player();
    player.game = gameId;

    const createdPlyer = await player.save();

    return {
      token: createdPlyer.id
    };
  }

  public async getCount() {
    const [result, count] = await this.repository.findAndCount();
    return count;
  }

  public async verifyToken(token) {
    try {
      const exist = await this.playerRepository.findOne(token, { relations: ['user'] });
      return !exist.user; // If user exist - you can`t use it again. If doesnt - can
    } catch (err) {
      return false;
    }
  }

  public async useToken(params) {
    const { user, token } = params;

    const player = await this.playerRepository.findOne(token, { relations: ['game', 'game.rounds', 'game.rounds.questions'] });

    await this.playerRepository.update(player.id, { user });

    return player;
  }

  public getUserGame = filter => this.playerRepository.findOne(filter);
}
