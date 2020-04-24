import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload, AuthResponse } from 'src/models';
import { UserDto } from 'src/db/dto';
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

  public async signUpAsPlayer(dto: UserDto, gameId) {
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
}
