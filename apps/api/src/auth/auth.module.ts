import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '@/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local/local.strategy';
// import { GithubStrategy } from './strategy/github.strategy';
// import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '999d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy], //, GithubStrategy, GoogleStrategy],
})
export class AuthModule {}
