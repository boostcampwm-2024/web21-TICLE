import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';

import { CreateUserDto } from '@/user/dto/create-user.dto';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    const user = this.authService.signup(createUserDto);
    return {
      status: 'success',
      data: user,
    };
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  localLogin(@Request() req) {
    return {
      status: 'success',
      data: this.authService.login(req.user),
    };
  }

  @Get('google/login')
  googleAuth() {}

  @Get('google/callback')
  googleAuthCallback() {}

  @Get('github/login')
  githubAuth() {}

  @Get('github/callback')
  githubAuthCallback() {}
}
