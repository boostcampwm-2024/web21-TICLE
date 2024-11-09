import { Module } from '@nestjs/common';

import { UserModule } from '@/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
// import { GithubStrategy } from './strategy/github.strategy';
// import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy], //, GithubStrategy, GoogleStrategy],
})
export class AuthModule {}
