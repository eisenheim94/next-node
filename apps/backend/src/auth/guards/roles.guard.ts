import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentUser, UserRole } from 'src/core/types';
import { ROLES_KEY } from '../decorators/roles.decorator';

export class RolesGuard implements CanActivate {
  constructor(private readonly refrlector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.refrlector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: CurrentUser }>();
    const user = request.user;

    if (!user) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}