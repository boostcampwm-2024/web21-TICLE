import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetUserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user.id;

  if (!user) {
    throw new UnauthorizedException('유저 정보가 존재하지 않습니다.');
  }

  return user;
});
