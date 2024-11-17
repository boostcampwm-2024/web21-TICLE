import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { UserService } from '@/user/user.service';

import { AuthService } from './auth.service';
import { SignupRequestDto } from './dto/signupRequest.dto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

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

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateLocalLogin', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      password: 'hashedPassword',
      nickname: 'Test User',
      email: 'test@example.com',
      introduce: 'Hello',
      profileImageUrl: 'http://example.com/image.jpg',
      provider: 'local',
      socialId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return user without password if validation is successful', async () => {
      mockUserService.findUser.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const { password, ...expectedResult } = mockUser;
      const result = await service.validateLocalLogin('testuser', 'password123');

      expect(result).toEqual(expectedResult);
      expect(userService.findUserByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    });

    it('should return null if user is not found', async () => {
      mockUserService.findUser.mockResolvedValue(null);

      const result = await service.validateLocalLogin('nonexistent', 'password123');

      expect(result).toBeNull();
      expect(userService.findUserByUsername).toHaveBeenCalledWith('nonexistent');
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null if password is invalid', async () => {
      mockUserService.findUser.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateLocalLogin('testuser', 'wrongpassword');

      expect(result).toBeNull();
      expect(userService.findUserByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
    });
  });

  describe('signup', () => {
    const signupDto: SignupRequestDto = {
      username: 'newuser',
      password: 'password123',
      nickname: 'New User',
      email: 'new@example.com',
      introduce: 'Hello World',
      profileImageUrl: 'http://example.com/new.jpg',
      provider: 'local',
      socialId: null,
    };

    const mockCreatedUser = {
      id: 1,
      ...signupDto,
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new user successfully', async () => {
      const { password, ...userWithoutPassword } = mockCreatedUser;
      mockUserService.createUser.mockResolvedValue(userWithoutPassword);

      const result = await service.signup(signupDto);

      expect(result).toEqual(userWithoutPassword);
      expect(userService.createUser).toHaveBeenCalledWith(signupDto);
    });
  });

  describe('login', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      nickname: 'Test User',
      email: 'test@example.com',
      introduce: 'Hello',
      profileImageUrl: 'http://example.com/image.jpg',
      provider: 'local',
      socialId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ticles: null,
      applicants: null,
    };

    it('should return access token when login is successful', async () => {
      const mockToken = 'mock.jwt.token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.createJWT(mockUser);

      expect(result).toEqual({ access_token: mockToken });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
      });
    });
  });
});
