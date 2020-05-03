import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/db/entities/user';
import { JwtPayload } from 'src/shared/models';
import { UserRepository } from 'src/db/repositories/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger = new Logger('JWT Strategy');
  constructor(
    @InjectRepository(UserRepository)
    private repository: UserRepository,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { name } = payload;
    const user = await this.repository.findOne({ name });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
