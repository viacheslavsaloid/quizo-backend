/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, ConflictException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from 'src/db/entities/game';
import { Player } from 'src/db/entities';
import { PlayerRepository, UserRepository } from 'src/db/repositories';
import {
  ToogleActiveRoundProps,
  GenerateGameTokenProps,
  ToogleAccessProps,
  HasAccessProps,
  RegisterToGameProps,
  VerifyPlayerParams,
  ToogleActiveRoundResponse,
  ToogleAccessResponse,
  HasAccessResponse,
  RegisterToGameResponse,
  VerifyPlayerResponse, GenerateGameTokenResponse
} from 'src/app/models/games';
import { AuthService } from '../../auth';

@Injectable()
export class GamesService extends TypeOrmCrudService<Game> {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private playerRepository: PlayerRepository,
    private userRepository: UserRepository,
    private authService: AuthService
  ) {
    super(gameRepository);
  }

  public async toogleActiveRound(params: ToogleActiveRoundProps): Promise<ToogleActiveRoundResponse> {
    const { roundId, gameId } = params;

    const game = await this.gameRepository.findOne(gameId);

    await this.gameRepository.update(gameId, { activeRound: game.activeRound !== roundId ? roundId : '' });

    const { activeRound } = await this.gameRepository.findOne(gameId);

    return { activeRound };
  }

  public async toogleAccess(params: ToogleAccessProps): Promise<ToogleAccessResponse> {
    const { playerId } = params;

    const player = await this.playerRepository.findOne(playerId);

    await this.playerRepository.update({ id: playerId }, { access: !player.access });

    const updatedPlayer = await this.playerRepository.findOne(player.id);

    return { access: updatedPlayer.access };
  }

  public async hasAccess(params: HasAccessProps): Promise<HasAccessResponse> {
    const { gameId, userId } = params;

    const game = await this.gameRepository.findOne(gameId);
    const user = await this.authService.getUser(userId);

    const player = await this.playerRepository.findOne({ game, user });

    return { access: player ? player.access : false };
  }

  public async generatePlayerToken(params: GenerateGameTokenProps): Promise<GenerateGameTokenResponse> {
    const { gameId, userId, role } = params;

    const game = await this.gameRepository.findOne(gameId);

    const player = new Player();
    player.game = game;
    player.role = role;

    if (userId) {
      const leader = await this.playerRepository.findOne(userId);

      player.leader = leader;
    }

    const createdPlayer = await player.save();

    return { token: createdPlayer.id };
  }

  public async registerToGame(params: RegisterToGameProps): Promise<RegisterToGameResponse> {
    try {
      // * You don`t need to send playerId, if !game.private; But if game IS private - you have to use playerId like a token;
      const { gameId, userId, playerId } = params;

      const game = await this.gameRepository.findOne(gameId);
      const user = await this.authService.getUser(userId);

      if (game.private) {
        const isPlayerVerified = await this.isPlayerVerified({ playerId, userId });
        if (!isPlayerVerified) {
          throw new Error('1005');
        }
      }

      const token = game.private ? playerId : (await this.generatePlayerToken({ gameId, role: 'leader' })).token;

      await this.playerRepository.update(token, { user });

      const player = await this.playerRepository.findOne(token);

      return { token: player.id };

    } catch (error) {
      throw new ConflictException({
        code: error.message
      });
    }
  }

  public async isPlayerVerified(params: VerifyPlayerParams): Promise<VerifyPlayerResponse> {
    try {
      const { playerId, userId } = params;
      const exist = await this.playerRepository.findOne(playerId, { relations: ['user'] }); // if player with this token already exist - return true, else throw error and return false
      return exist.user ? exist.user.id === userId : true; // If user exist, and you arent this user - can`t use it again. If user doesnt exist - you can use it;
    } catch (error) {
      return false;
    }
  }

  public async getCount(options): Promise<number> {
    const [_, count] = await this.gameRepository.findAndCount(options);
    return count;
  }

  public getPlayer = async (id, options): Promise<Player> => this.playerRepository.findOne(id, options);
}
