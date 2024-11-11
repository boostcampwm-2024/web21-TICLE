import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '@/entity/user.entity';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UserService } from '@/user/user.service';

import { SignupRequestDto } from './dto/signupRequest.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  /**
   * 비밀번호 일치 여부 확인
   * @param username
   * @param password
   * @returns 비밀번호가 일치하면 유저 정보 반환(비밀번호 제외), 아니면 null 반환
   */
  async validateLocalLogin(username: string, password: string): Promise<Omit<User, 'password'>> {
    const user: User | undefined = await this.userService.findUser(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('잘못된 로그인 정보');
  }

  /**
   * 회원가입 로직 (todo : 회원가입에 필요한 로직 추가 또는 단일화)
   * @param createUserDto
   * @returns 회원가입 성공시 유저 정보 반환(비밀번호 제외)
   */
  async signup(signupRequestDto: SignupRequestDto): Promise<Omit<User, 'password'>> {
    return this.userService.createUser(signupRequestDto);
  }

  /**
   * passport 인증 후 access_token 반환 (todo : 로그인 성공시 필요한 데이터들 추가해야함.)
   * @param user
   * @returns access_token
   */
  async createJWT(user: Omit<User, 'password'>): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
