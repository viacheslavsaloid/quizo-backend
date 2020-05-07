import { ExecutionContext, NestInterceptor, CallHandler, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_BUILDER_TOKEN, RolesBuilder, Role } from 'nest-access-control';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { DebugLogger } from '../utils/debug/debug.helper';

export class AccessControlInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly reflector: Reflector, @Inject(ROLES_BUILDER_TOKEN) private readonly accessControl: RolesBuilder) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    DebugLogger(this);
    const permissions = this.getPermissions(context) as any;

    const req = context.switchToHttp().getRequest();
    const { user } = req;

    return next.handle().pipe(
      map((data: any) => {
        const dataWithPermissions = permissions.reduce((acc: any, permission) => permission.filter(acc), data);

        return data;
      })
    );
  }

  protected getPermissions(context: ExecutionContext) {
    return this.getHandlerRoles(context).map(role => this.accessControl.permission(role));
  }

  protected getHandlerRoles(context: ExecutionContext): Role[] {
    return this.reflector.get<Role[]>('roles', context.getHandler()) || [];
  }
}
