import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '@/entity/user.entity';
import { UserService } from '@/user/user.service';

import { SignupRequestDto } from './dto/signupRequest.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateLocalLogin(username: string, inputPassword: string) {
    const user = await this.userService.findUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('잘못된 로그인 정보');
    }
    const isPasswordValid = await bcrypt.compare(inputPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('잘못된 로그인 정보');
    }
    const { password, ...result } = user;
    return result;
  }

  async signup(signupRequestDto: SignupRequestDto) {
    return this.userService.createUser(signupRequestDto);
  }

  async createJWT(user: Omit<User, 'password'>): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id };
  async createJWT(user: Omit<User, 'password'>) {
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
