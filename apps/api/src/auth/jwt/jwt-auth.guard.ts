import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const cookies = req.cookies;

    const token = cookies['accessToken'];

    if (token) req.headers.authorization = `Bearer ${token}`;

    return req;
  }
}
