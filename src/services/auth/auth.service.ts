import { Injectable, Logger, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload, AuthResponse } from 'src/shared/models';
import { UserDto } from 'src/shared/dto';
import { GamesService } from '../game';
import { UserRole } from 'src/db/entities/user';
import { UserRepository } from 'src/db/repositories/user';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private repository: UserRepository,
    private jwtService: JwtService,
    private gamesService: GamesService
  ) {}

  public getToken = async (payload: JwtPayload) => ({
    token: await this.jwtService.sign(payload)
  });

  public async getTelegramUser(telegramId) {
    const exist = await this.repository.findOne(
      { telegramId },
      { relations: ['accessGames', 'accessGames.user', 'accessGames.game'] }
    );

    if (exist) {
      return exist;
    }

    const user = await this.repository.signUp({ telegramId, roles: [UserRole.PLAYER] });
    return user;
  }

  public async signUpAsPlayer(dto: UserDto, gameId) {
    const game = await this.gamesService.findOne({ id: gameId });

    if (game.private) {
      try {
        this.jwtService.verify(dto.token);
      } catch (err) {
        throw new InternalServerErrorException({
          code: 1005
        });
      }

      // const token = await this.usedTokenRepostiory.findOne({ token: dto.token });
      // if (token) {
      //   throw new HttpException('Invalid crendentials', HttpStatus.NOT_FOUND);
      // }

      const decodedToken = this.jwtService.decode(dto.token) as { gameId: string };

      if (decodedToken.gameId !== gameId) {
        throw new HttpException('Invalid crendentials', HttpStatus.BAD_REQUEST);
      }
    }

    const user = await this.repository.signUp({ ...dto, roles: [UserRole.PLAYER] });
    const { name, id, roles } = await this.gamesService.registerUser({ gameId, user });

    return this.getToken({ name, id, roles });
  }

  public async signUp(dto: UserDto): Promise<AuthResponse> {
    const { name, id, roles } = await this.repository.signUp({ ...dto, roles: [UserRole.COMPANY] });
    return this.getToken({ name, id, roles });
  }

  public async signIn(dto: UserDto): Promise<AuthResponse> {
    const { name, id, roles } = await this.repository.signIn(dto);
    return this.getToken({ name, id, roles });
  }

  public async isOwner(userId, id) {
    const user = await this.repository.findOne(userId, { relations: ['ownGames'] });
    const isOwner = user.ownGames.find(x => x.id === id);
    return isOwner;
  }

  public async decodeToken(token) {
    return this.jwtService.decode(token);
  }

  public async verifyToken(token) {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      return false;
    }
  }

  public async getUser(params) {
    return this.repository.findOne(params);
  }

  public async createPlayer(params) {
    return this.repository.signUp({ ...params, roles: [UserRole.PLAYER] });
  }
}
