import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const cookies = req.cookies;
    const token = cookies['accessToken'];

    if (!token) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    req.headers.authorization = `Bearer ${token}`;

    return req;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException('잘못된 인증 정보입니다.');
    }
    return user;
  }
}
