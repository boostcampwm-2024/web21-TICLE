import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessage } from '@repo/types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const cookies = req.cookies;
    const token = cookies['accessToken'];

    if (!token) {
      throw new UnauthorizedException(ErrorMessage.LOGIN_REQUIRED);
    }
    req.headers.authorization = `Bearer ${token}`;

    return req;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException(ErrorMessage.INVALID_AUTHENTICATION_INFORMATION);
    }
    return user;
  }
}
