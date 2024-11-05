import { Controller, Get, Patch, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('/signup')
  signup() {}

  @Post('login')
  localLogin() {}

  @Get('profile')
  profile() {
    return 'profile';
  }

  @Patch('/profile')
  patchProfile() {}

  @Get('google/login')
  googleAuth() {}

  @Get('google/callback')
  googleAuthCallback() {}

  @Get('github/login')
  githubAuth() {}

  @Get('github/callback')
  githubAuthCallback() {}
}
