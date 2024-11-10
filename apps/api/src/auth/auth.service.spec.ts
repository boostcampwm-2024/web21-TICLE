import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    username: 'testuser',
    password: 'hashedPassword',
    nickname: 'Test User',
    email: 'test@example.com',
    introduce: 'Hello',
    profileImageUrl: 'http://example.com/profile.jpg',
    provider: 'local',
    socialId: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    ticles: [],
    applicants: [],
  };

  const mockUserService = {
    findUser: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateLocalLogin', () => {
    it('should return user without password if credentials are valid', async () => {
      const username = 'testuser';
      const password = 'password123';
      const { password: _, ...userWithoutPassword } = mockUser;

      mockUserService.findUser.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateLocalLogin(username, password);

      expect(result).toEqual(userWithoutPassword);
      expect(mockUserService.findUser).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });

    it('should return null if user is not found', async () => {
      mockUserService.findUser.mockResolvedValue(null);

      const result = await authService.validateLocalLogin('nonexistent', 'password123');

      expect(result).toBeNull();
      expect(mockUserService.findUser).toHaveBeenCalledWith('nonexistent');
    });

    it('should return null if password is invalid', async () => {
      mockUserService.findUser.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateLocalLogin('testuser', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('signup', () => {
    it('should create a new user if username does not exist', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'password123',
        nickname: 'New User',
        email: 'new@example.com',
        introduce: 'Hello',
        profileImageUrl: 'http://example.com/profile.jpg',
        provider: 'local',
        socialId: '',
      };

      const { password: _, ...expectedUser } = mockUser;

      mockUserService.findUser.mockResolvedValue(null);
      mockUserService.createUser.mockResolvedValue(expectedUser);

      const result = await authService.signup(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockUserService.findUser).toHaveBeenCalledWith(createUserDto.username);
      expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw ConflictException if username already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'existinguser',
        password: 'password123',
        nickname: 'Existing User',
        email: 'existing@example.com',
        introduce: 'Hello',
        profileImageUrl: 'http://example.com/profile.jpg',
        provider: 'local',
        socialId: '',
      };

      mockUserService.findUser.mockResolvedValue(mockUser);

      await expect(authService.signup(createUserDto)).rejects.toThrow(ConflictException);
      expect(mockUserService.findUser).toHaveBeenCalledWith(createUserDto.username);
      expect(mockUserService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return access token for valid user', async () => {
      const { password: _, ...userWithoutPassword } = mockUser;
      const mockToken = 'mock.jwt.token';

      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await authService.login(userWithoutPassword);

      expect(result).toEqual({ access_token: mockToken });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: userWithoutPassword.username,
        sub: userWithoutPassword.id,
      });
    });
  });
});
