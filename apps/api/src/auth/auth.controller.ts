import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LocalLoginRequestDto } from './dto/localLoginRequest.dto';
import { LocalLoginResponseDto } from './dto/localLoginResponse.dto';
import { SignupRequestDto } from './dto/signupRequest.dto';
import { SignupResponseDto } from './dto/signupResponse.dto';
import { LocalAuthGuard } from './local/local-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, type: SignupResponseDto })
  @ApiResponse({ status: 409 })
  async signup(@Body() createUserDto: SignupRequestDto) {
    const user = await this.authService.signup(createUserDto);
    return {
      status: 'success',
      data: user,
    };
  }

  @Post('login')
  @ApiOperation({ summary: '로컬 로그인' })
  @ApiBody({ type: LocalLoginRequestDto })
  @ApiResponse({ status: 200, type: LocalLoginResponseDto })
  @ApiResponse({ status: 401 })
  @UseGuards(LocalAuthGuard)
  async localLogin(@Request() req) {
    return {
      status: 'success',
      data: await this.authService.createJWT(req.user),
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
