import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ErrorMessage } from '@repo/types';

import { User } from '@/entity/user.entity';

import { CreateLocalUserDto } from './dto/createLocalUser.dto';
import { CreateSocialUserDto } from './dto/createSocialUser.dto';
import { UserProfileDto } from './dto/userProfileDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async createLocalUser(createUserDto: CreateLocalUserDto) {
    await this.throwIfExistUsername(createUserDto.username);
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    const { password, ...result } = user;
    return result;
  }

  async createSocialUser(socialUserData: CreateSocialUserDto) {
    const user = this.userRepository.create(socialUserData);
    await this.userRepository.save(user);
    return user;
  }

  async throwIfExistUsername(username: string) {
    const existingUser = await this.userRepository.exists({
      where: {
        username,
      },
    });
    if (existingUser) {
      throw new ConflictException(ErrorMessage.USER_NAME_ALREADY_IN_USE);
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

  async findUserProfileByUserId(userId: number): Promise<UserProfileDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'nickname', 'profileImageUrl', 'provider'],
    });

    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }

    return user;
  }
}
