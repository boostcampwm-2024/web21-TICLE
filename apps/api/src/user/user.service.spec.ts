import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from '@/entity/user.entity';

import { CreateLocalUserDto } from './dto/createLocalUser.dto';
import { CreateSocialUserDto } from './dto/createSocialUser.dto';
import { UserService } from './user.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;

  // Mock Repository
  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    exists: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createLocalUser', () => {
    const createLocalUserDto: CreateLocalUserDto = {
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com',
      provider: 'local',
    };

    beforeEach(() => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockUserRepository.exists.mockRejectedValue(new Error('DB Error'));

      await expect(service.createLocalUser(createLocalUserDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('createSocialUser', () => {
    const createSocialUserDto: CreateSocialUserDto = {
      email: 'social@example.com',
      provider: 'google',
      socialId: '12345',
    };

    it('should create a new social user successfully', async () => {
      const mockUser = {
        id: 1,
        ...createSocialUserDto,
      };

      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.createSocialUser(createSocialUserDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(createSocialUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockUserRepository.create.mockReturnValue(createSocialUserDto);
      mockUserRepository.save.mockRejectedValue(new Error('DB Error'));

      await expect(service.createSocialUser(createSocialUserDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('throwIfExistUsername', () => {
    it('should not throw if username does not exist', async () => {
      mockUserRepository.exists.mockResolvedValue(false);

      await expect(service.throwIfExistUsername('newuser')).resolves.not.toThrow();
    });

    it('should throw ConflictException if username exists', async () => {
      mockUserRepository.exists.mockResolvedValue(true);

      await expect(service.throwIfExistUsername('existinguser')).rejects.toThrow(
        new ConflictException('이미 사용 중인 사용자 이름입니다.')
      );
    });
  });

  describe('findUserByUsername', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    };

    it('should return user if found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findUserByUsername('testuser');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findUserByUsername('nonexistent');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'nonexistent' },
      });
      expect(result).toBeNull();
    });
  });

  describe('findUserBySocialIdAndProvider', () => {
    const mockSocialUser = {
      id: 1,
      socialId: '12345',
      provider: 'google',
      username: 'socialuser',
      email: 'social@example.com',
    };

    it('should return user if found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockSocialUser);

      const result = await service.findUserBySocialIdAndProvider('12345', 'google');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { socialId: '12345', provider: 'google' },
      });
      expect(result).toEqual(mockSocialUser);
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findUserBySocialIdAndProvider('nonexistent', 'google');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { socialId: 'nonexistent', provider: 'google' },
      });
      expect(result).toBeNull();
    });
  });
});
