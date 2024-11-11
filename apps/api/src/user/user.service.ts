import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from '@/entity/user.entity';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  /**
   * 유저 생성
   * @param createUserDto
   * @returns 비밀번호 제외한 유저 정보
   */
  async createUser(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const user = this.userRepository.create({
        ...createUserDto,
        password: await this.hashPassword(createUserDto.password),
      });
      await this.userRepository.save(user);

      const { password, ...result } = user;
      return result;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        const message = error.message;
        if (message.includes('UQ_user_username')) {
          throw new ConflictException('이미 사용 중인 사용자 이름입니다.');
        }
        if (message.includes('UQ_user_email')) {
          throw new ConflictException('이미 사용 중인 이메일입니다.');
        }
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   * 로그인 시 유저정보 반환 (todo : 불필요한 데이터 보내지 않게 수정)
   * @param username
   * @returns User 객체
   */
  async findUser(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      return null;
    }

    return user;
  }

  /**
   * 비밀번호 해싱
   * @param password
   * @param saltRounds
   * @returns
   */
  private async hashPassword(password: string, saltRounds = 10): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }
}
