import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../auth.service';
import { LocalStrategy } from './local.strategy';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));
describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  // Mock AuthService
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

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('validate', () => {
    const mockCredentials = {
      username: 'testuser',
      password: 'password123',
    };

    it('should call authService.validateLocalLogin with correct credentials', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
      mockAuthService.validateLocalLogin.mockResolvedValue(mockUser);

      await strategy.validate(mockCredentials.username, mockCredentials.password);

      expect(authService.validateLocalLogin).toHaveBeenCalledWith(
        mockCredentials.username,
        mockCredentials.password
      );
    });

    it('should return user id when validation is successful', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
      mockAuthService.validateLocalLogin.mockResolvedValue(mockUser);

      const result = await strategy.validate(mockCredentials.username, mockCredentials.password);

      expect(result).toEqual({ id: mockUser.id });
    });

    it('should throw UnauthorizedException when authentication fails', async () => {
      mockAuthService.validateLocalLogin.mockRejectedValue(
        new UnauthorizedException('잘못된 로그인 정보')
      );

      await expect(
        strategy.validate(mockCredentials.username, mockCredentials.password)
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should handle empty credentials properly', async () => {
      mockAuthService.validateLocalLogin.mockRejectedValue(
        new UnauthorizedException('잘못된 로그인 정보')
      );

      await expect(strategy.validate('', '')).rejects.toThrow(UnauthorizedException);

      expect(authService.validateLocalLogin).toHaveBeenCalledWith('', '');
    });

    it('should properly pass through any errors from authService', async () => {
      const customError = new UnauthorizedException('Custom error message');
      mockAuthService.validateLocalLogin.mockRejectedValue(customError);

      await expect(
        strategy.validate(mockCredentials.username, mockCredentials.password)
      ).rejects.toThrow(customError);
    });
  });
});
