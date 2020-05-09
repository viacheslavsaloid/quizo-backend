import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/db/repositories/user';
import { SignUpProps, SignInProps, GenerateAuthTokenProps, IsOwnerProps, GetUserProps } from 'src/app/models/auth';
import { User } from 'src/db/entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  public async signUp(props: SignUpProps): Promise<User> {
    const { dto, role } = props;
    return this.userRepository.signUp({ ...dto, roles: [role] });
  }

  public async signIn(props: SignInProps): Promise<User> {
    const { dto } = props;

    return this.userRepository.signIn(dto);
  }

  public async generateAuthToken(props: GenerateAuthTokenProps) {
    const { payload, fields = [], exceptFields = [] } = props;

    const toToken = fields.length ? {} : { ...payload };

    fields.forEach(field => {
      toToken[field] = payload[field];
    });

    exceptFields.forEach(field => {
      delete toToken[field];
    });

    const token = await this.jwtService.sign(toToken);

    return {
      token
    };
  }

  public async isOwner(props: IsOwnerProps) {
    const { userId, gameId } = props;
    const user = await this.userRepository.findOne(userId, { relations: ['ownGames'] });
    const isOwner = user.ownGames.find(game => game.id === gameId);
    return isOwner;
  }

  public getUser = (params: GetUserProps) => this.userRepository.findOne(params);

  public decodeToken = (token: string) => this.jwtService.decode(token);
}
