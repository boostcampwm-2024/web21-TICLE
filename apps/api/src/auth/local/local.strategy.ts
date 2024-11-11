import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * local strategy 유저 인증
   * @param username
   * @param password
   * @returns
   */
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateLocalLogin(username, password);
    return user;
  }
}
