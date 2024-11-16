import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    if (!username || !password) {
      throw new UnauthorizedException('아이디와 비밀번호를 입력해주세요.');
    }
    const user = await this.authService.validateLocalLogin(username, password);
    return user;
  }
}
