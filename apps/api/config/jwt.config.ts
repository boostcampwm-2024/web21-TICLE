import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export function createJwtOptions(configService: ConfigService): JwtModuleOptions {
  return {
    secret: configService.get<string>('JWT_SECRET'), // 환경 변수에서 JWT 비밀 키를 가져옴
    signOptions: { expiresIn: '99d' }, // 토큰 만료 기간 설정
  };
}
