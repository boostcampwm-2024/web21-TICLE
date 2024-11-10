import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '@/entity/user.entity';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UserService } from '@/user/user.service';

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
  async validateLocalLogin(
    username: string,
    password: string
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findUser(username);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  /**
   * 회원가입 로직
   * @param createUserDto
   * @returns 회원가입 성공시 유저 정보 반환(비밀번호 제외)
   */
  async signup(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // username 중복 체크 중복 시 ConflictException 발생
    const existingUser = await this.userService.findUser(createUserDto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    return this.userService.createUser(createUserDto);
  }

  /**
   * passport 인증 후 로그인 로직 access_token 반환 (todo : 로그인 성공시 필요한 데이터들 추가해야함.)
   * @param user
   * @returns access_token
   */
  async login(user: Omit<User, 'password'>): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
