import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  const mockUser = {
    id: 1,
    username: 'testuser',
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

  const mockAuthService = {
    validateLocalLogin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return a user when credentials are valid', async () => {
      const username = 'testuser';
      const password = 'password123';
      mockAuthService.validateLocalLogin.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(username, password);

      expect(authService.validateLocalLogin).toHaveBeenCalledWith(username, password);
      expect(result).toEqual(mockUser);
      expect(authService.validateLocalLogin).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const username = 'wronguser';
      const password = 'wrongpassword';
      mockAuthService.validateLocalLogin.mockResolvedValue(null);

      await expect(localStrategy.validate(username, password)).rejects.toThrow(
        UnauthorizedException
      );

      expect(authService.validateLocalLogin).toHaveBeenCalledWith(username, password);
      expect(authService.validateLocalLogin).toHaveBeenCalledTimes(1);
    });
  });
});
