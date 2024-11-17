import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { User } from '@/entity/user.entity';

export const GetUser = createParamDecorator((data: 'id' | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user: User = request.user;

  if (!user) {
    throw new UnauthorizedException('유저 정보가 존재하지 않습니다.');
  }

  if (data) {
    return user[data];
  }

  return user;
});
