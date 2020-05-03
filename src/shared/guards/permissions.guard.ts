import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRolesBuilder, RolesBuilder, Role } from 'nest-access-control';
import { IQueryInfo } from 'accesscontrol';
import { User } from 'src/db/entities';
import { DebugLogger } from '../helpers';
import { AuthService } from 'src/services/auth/auth.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder,
    private readonly reflector: Reflector,
    private authService: AuthService
  ) {}

  protected async getUser(context: ExecutionContext): Promise<User> {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }

  protected async getRequest(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    return request;
  }

  protected async getUserRoles(context: ExecutionContext): Promise<string | string[]> {
    const user = await this.getUser(context);
    if (!user) throw new UnauthorizedException();
    return user.roles;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    DebugLogger(this);

    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const req = await this.getRequest(context);
    const userRoles = await this.getUserRoles(context);

    if (req.params.id && req.method !== 'GET') {
      const isOwner = await this.authService.isOwner(req.user.id, req.params.id);

      if (!isOwner) {
        throw new UnauthorizedException();
      }
    }

    const hasRoles = roles.every(role => {
      const queryInfo: IQueryInfo = role;
      queryInfo.role = userRoles;
      const permission = this.roleBuilder.permission(queryInfo);
      return permission.granted;
    });
    return hasRoles;
  }
}
