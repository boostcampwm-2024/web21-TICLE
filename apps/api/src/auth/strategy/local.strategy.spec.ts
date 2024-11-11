import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
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

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    const mockUsername = 'testuser';
    const mockPassword = 'password123';
    const mockUser = {
      id: 1,
      username: mockUsername,
      email: 'test@example.com',
    };

    it('should return user object when validation is successful', async () => {
      mockAuthService.validateUser.mockResolvedValue(mockUser);

      const result = await strategy.validate(mockUsername, mockPassword);

      expect(authService.validateUser).toHaveBeenCalledWith(mockUsername, mockPassword);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when validation fails', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate(mockUsername, mockPassword)).rejects.toThrow(
        UnauthorizedException
      );

      expect(authService.validateUser).toHaveBeenCalledWith(mockUsername, mockPassword);
    });

    it('should call AuthService.validateUser with correct parameters', async () => {
      mockAuthService.validateUser.mockResolvedValue(mockUser);

      await strategy.validate(mockUsername, mockPassword);

      expect(authService.validateUser).toHaveBeenCalledWith(mockUsername, mockPassword);
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
    });
  });
});
