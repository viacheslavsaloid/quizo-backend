import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from 'src/db/entities';
import { DebugLogger } from '../helpers';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    DebugLogger(this);
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      const request = context.switchToHttp().getRequest();
      const isAuth = request.headers.authorization;

      if (!isAuth) {
        const user = new User();
        user.roles = [UserRole.NOT_REGISTERED];
        request.user = user;

        return true;
      }
    }

    return super.canActivate(context);
  }
}
