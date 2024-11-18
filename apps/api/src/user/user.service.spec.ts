import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from '@/entity/user.entity';

import { CreateLocalUserDto } from './dto/createLocalUser.dto';
import { UserService } from './user.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    const createUserDto: CreateLocalUserDto = {
      username: 'testuser',
      password: 'password123',
      nickname: 'Test User',
      email: 'test@example.com',
      introduce: 'Hello, I am a test user',
      profileImageUrl: 'http://example.com/image.jpg',
      provider: 'local',
    };

    const mockUser = {
      id: 1,
      ...createUserDto,
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
      ticles: [],
      applicants: [],
    };

    it('should create a new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword'));
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.createLocalUser(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        ...mockUser,
        password: undefined,
      });
    });

    it('should throw an error if user creation fails', async () => {
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.createLocalUser(createUserDto)).rejects.toThrow('Database error');
    });
  });

  describe('findUser', () => {
    const username = 'testuser';
    const mockUser = {
      id: 1,
      username,
      password: 'hashedPassword',
      nickname: 'Test User',
      email: 'test@example.com',
      introduce: 'Hello',
      profileImageUrl: 'http://example.com/image.jpg',
      provider: 'local',
      socialId: '12345',
      createdAt: new Date(),
      updatedAt: new Date(),
      ticles: [],
      applicants: [],
    };

    it('should return a user if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findUserByUsername(username);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findUserByUsername(username);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toBeNull();
    });
  });
});
