import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

import { User } from '@/entity/user.entity';

import { AuthService } from './auth.service';
import { LocalLoginRequestDto } from './dto/localLoginRequest.dto';
import { LocalSignupRequestDto } from './dto/localSignupRequest.dto';
import { LoginSuccessResponseDto } from './dto/loginResponse.dto';
import { SignupResponseDto } from './dto/signupResponse.dto';
import { GitHubAuthGuard } from './github/github-auth.guard';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { LocalAuthGuard } from './local/local-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, type: SignupResponseDto })
  @ApiResponse({ status: 409 })
  async signup(@Body() createUserDto: LocalSignupRequestDto): Promise<SignupResponseDto> {
    const user = await this.authService.signupLocal(createUserDto);
    return {
      status: 'success',
      data: user,
    };
  }

  @Post('login')
  @ApiOperation({ summary: '로컬 로그인' })
  @ApiBody({ type: LocalLoginRequestDto })
  @ApiResponse({ status: 200, type: LoginSuccessResponseDto })
  @ApiResponse({ status: 401 })
  @UseGuards(LocalAuthGuard)
  async localLogin(@Request() req: ExpressRequest): Promise<LoginSuccessResponseDto> {
    const jwtToken = await this.authService.createJWT(req.user as Omit<User, 'password'>);
    return {
      status: 'success',
      data: jwtToken,
    };
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: ExpressRequest): Promise<LoginSuccessResponseDto> {
    const jwtToken = await this.authService.createJWT(req.user as Omit<User, 'password'>);
    return {
      status: 'success',
      data: jwtToken,
    };
  }

  @Get('github/login')
  @UseGuards(GitHubAuthGuard)
  githubAuth() {}

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  async githubAuthCallback(@Req() req: ExpressRequest): Promise<LoginSuccessResponseDto> {
    const jwtToken = await this.authService.createJWT(req.user as Omit<User, 'password'>);
    return {
      status: 'success',
      data: jwtToken,
    };
  }
}
