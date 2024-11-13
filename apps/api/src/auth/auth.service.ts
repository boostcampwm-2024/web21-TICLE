import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '@/entity/user.entity';
import { UserService } from '@/user/user.service';

import { SignupRequestDto } from './dto/signupRequest.dto';

interface socialUserDto {
  provider: string;
  socialId: string;
  username: string;
  email: string;
  profileImageUrl?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signup(signupRequestDto: SignupRequestDto) {
    return this.userService.createUser(signupRequestDto);
  }

  async validateLocalLogin(email: string, inputPassword: string) {
    const user = await this.userService.findUserByEmail(email);
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

  async cheeckSocialUser(userSocialData: socialUserDto) {
    const user = await this.userService.findUserByEmail(userSocialData.email);
    if (!user) {
      const randomValue = Math.random().toString(36).slice(-15);
      return await this.userService.createUser({
        ...userSocialData,
        password: randomValue,
      });
    }
    return user;
  }

  async createJWT(user: Omit<User, 'password'>) {
    const payload = { username: user.username, sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
