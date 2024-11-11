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

  async createUser(createUserDto: CreateUserDto) {
    try {
      await this.throwIfExistUser(createUserDto.username);
      await this.throwIfExistEmail(createUserDto.email);
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      await this.userRepository.save(user);
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async throwIfExistUser(username: string) {
    const existingUser = await this.userRepository.exists({
      where: {
        username,
      },
    });
    if (existingUser) {
      throw new ConflictException('이미 사용 중인 사용자 이름입니다.');
    }
  }

  async throwIfExistEmail(email: string) {
    const existingEmail = await this.userRepository.exists({
      where: {
        email,
      },
    });
    if (existingEmail) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async findUserById(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      return null;
    }
    return user;
  }
}
