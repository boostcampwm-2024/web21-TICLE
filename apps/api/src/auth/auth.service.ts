import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '@/entity/user.entity';
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
    const existingUser = await this.userService.findUserByUsername(signupRequestDto.username);
    if (existingUser) {
      throw new BadRequestException('이미 사용 중인 사용자 이름입니다.');
    }
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
    const { password, ...result } = user;
    return result;
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

  async createJWT(user: Omit<User, 'password'>) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
