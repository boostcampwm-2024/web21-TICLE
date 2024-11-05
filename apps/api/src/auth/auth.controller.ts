import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('signup')
  signup() {}

  @Post('login')
  localLogin() {}

  @Get('google/login')
  googleAuth() {}

  @Get('google/callback')
  googleAuthCallback() {}

  @Get('github/login')
  githubAuth() {}

  @Get('github/callback')
  githubAuthCallback() {}
}
