import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRolesBuilder, RolesBuilder, Role } from 'nest-access-control';
import { IQueryInfo } from 'accesscontrol';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DebugLogger } from '../utils/debug/debug.helper';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder,
    private readonly reflector: Reflector,
    private authService: AuthService
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    DebugLogger(this);

    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) throw new UnauthorizedException();

    if (request.params.id && request.method !== 'GET') {
      const isOwner = await this.authService.isOwner({ userId: request.user.id, gameId: request.params.id });

      if (!isOwner) {
        throw new UnauthorizedException();
      }
    }

    const hasRoles = roles.every(role => {
      const queryInfo: IQueryInfo = role;
      queryInfo.role = user.roles;
      const permission = this.roleBuilder.permission(queryInfo);
      return permission.granted;
    });

    return hasRoles;
  }
}
