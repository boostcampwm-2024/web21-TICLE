import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ErrorMessage } from '@repo/types';

export const GetUserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user.id;

  if (!user) {
    throw new UnauthorizedException(ErrorMessage.USER_NOT_FOUND);
  }

  return user;
});
