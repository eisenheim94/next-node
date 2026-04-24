import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { CurrentUser, UserRole } from '../../core/types';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: CurrentUser }>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication is required');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin role is required');
    }

    return true;
  }
}
