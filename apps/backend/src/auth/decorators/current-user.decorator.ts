import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser } from 'src/core/types';

export const CurrentUserDecorator = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUser => {
    const request = context.switchToHttp().getRequest<{ user: CurrentUser }>();
    return request.user;
  }
);
