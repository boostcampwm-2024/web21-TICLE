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

  async createLocalUser(createUserDto: CreateUserDto) {
    try {
      await this.throwIfExistUsername(createUserDto.username);
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

  async throwIfExistUsername(username: string) {
    const existingUser = await this.userRepository.exists({
      where: {
        username,
      },
    });
    if (existingUser) {
      throw new ConflictException('이미 사용 중인 사용자 이름입니다.');
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

  async findUserBySocialIdAndProvider(socialId: string, provider: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { socialId, provider },
    });
    if (!user) {
      return null;
    }
    return user;
  }
}
