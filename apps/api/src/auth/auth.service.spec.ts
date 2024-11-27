import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '@/user/user.service';

import { AuthService } from './auth.service';

// bcrypt mock 수정
const bcrypt = {
  compare: jest.fn(),
};

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  let jwtService: JwtService;

  // Mock UserService
  const mockUserService = {
    findUserByUsername: jest.fn(),
    createLocalUser: jest.fn(),
    findUserBySocialIdAndProvider: jest.fn(),
    createSocialUser: jest.fn(),
  };

  // Mock JwtService
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

    jwtService = module.get<JwtService>(JwtService);

    // Clear all mocks before each test
    jest.clearAllMocks();
    bcrypt.compare.mockClear();
  });

  describe('validateLocalLogin', () => {
    const loginCredentials = {
      username: 'testuser',
      password: 'password123',
    };

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUserService.findUserByUsername.mockResolvedValue(null);

      await expect(
        service.validateLocalLogin(loginCredentials.username, loginCredentials.password)
      ).rejects.toThrow(new UnauthorizedException('잘못된 로그인 정보'));
    });
  });

  describe('createJWT', () => {
    it('should create JWT token with user ID', async () => {
      const userId = 1;
      const mockToken = 'mock.jwt.token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.createJWT(userId);

      expect(jwtService.sign).toHaveBeenCalledWith({ sub: userId });
      expect(result).toEqual({ accessToken: mockToken });
    });
  });
});
