import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload, AuthResponse } from 'src/shared';
import { UserDto, UserRepository } from 'src/db';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private repository: UserRepository,
    private jwtService: JwtService
  ) {}

  public getToken = async (payload: JwtPayload) => ({
    token: await this.jwtService.sign(payload)
  });

  public async signUp(dto: UserDto): Promise<AuthResponse> {
    const { name } = await this.repository.signUp(dto);
    return this.getToken({ name });
  }

  public async signIn(dto: UserDto): Promise<AuthResponse> {
    const { name } = await this.repository.signIn(dto);
    return this.getToken({ name });
  }
}
