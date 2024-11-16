import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '@/entity/user.entity';
import { UserService } from '@/user/user.service';

import { SignupRequestDto } from './dto/signupRequest.dto';

interface SocialUserDto {
  provider: string;
  socialId: string;
  nickname: string;
  email: string;
  profileImageUrl?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signupLocal(signupRequestDto: SignupRequestDto) {
    return this.userService.createLocalUser(signupRequestDto);
  }

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

  async checkSocialUser(socialUserData: SocialUserDto) {
    const user = await this.userService.findUserBySocialIdAndProvider(
      socialUserData.socialId,
      socialUserData.provider
    );
    if (!user) {
    }
    return user;
  }

  async createJWT(user: Omit<User, 'password'>) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
