import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateSocialUserDto } from '@/user/dto/createSocialUser.dto';
import { UserService } from '@/user/user.service';

import { LocalSignupRequestDto } from './dto/localSignupRequest.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signupLocal(signupRequestDto: LocalSignupRequestDto) {
    return this.userService.createLocalUser({ provider: 'local', ...signupRequestDto });
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
    return user;
  }

  async createGuestUser() {
    const randomNum = Math.floor(Math.random() * 10000);
    const response = await fetch('https://api.thecatapi.com/v1/images/search');
    const catImageUrl = (await response.json())[0].url;

    const guestUser = {
      username: `guest_${randomNum}`,
      password: `guest_password_${randomNum}`,
      email: `guet_email@guest.com`,
      nickname: `guest_${randomNum}`,
      introduce: `게스트 사용자입니다. `,
      profileImageUrl: catImageUrl,
    };
    const user = await this.userService.findUserByUsername(guestUser.username);
    if (!user) {
      return this.userService.createLocalUser({ provider: 'guest', ...guestUser });
    }
    return user;
  }

  async checkSocialUser(socialUserData: CreateSocialUserDto) {
    const user = await this.userService.findUserBySocialIdAndProvider(
      socialUserData.socialId,
      socialUserData.provider
    );
    if (!user) {
      return this.userService.createSocialUser(socialUserData);
    }
    return user;
  }

  createJWT(userId: number) {
    const payload = { sub: userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
