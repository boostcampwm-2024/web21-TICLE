import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { GetUserId } from '@/common/decorator/get-userId.decorator';

import { AuthService } from './auth.service';
import { LocalLoginRequestDto } from './dto/localLoginRequest.dto';
import { LocalSignupRequestDto } from './dto/localSignupRequest.dto';
import { SignupResponseDto } from './dto/signupResponse.dto';
import { GitHubAuthGuard } from './github/github-auth.guard';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { LocalAuthGuard } from './local/local-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {}

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
  @ApiResponse({ status: 302, description: '홈으로 리다이렉션' })
  @ApiResponse({ status: 401 })
  @UseGuards(LocalAuthGuard)
  localLogin(@GetUserId() userId: number, @Res() response: Response) {
    this.cookieInsertJWT(response, userId);
  }

  @Get('google/login')
  @ApiOperation({ summary: '구글 OAuth 로그인' })
  @ApiResponse({ status: 302, description: '홈으로 리다이렉션' })
  @ApiResponse({ status: 401 })
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthCallback(@GetUserId() userId: number, @Res() response: Response) {
    this.cookieInsertJWT(response, userId);
  }

  @Get('github/login')
  @ApiOperation({ summary: '깃허브 OAuth 로그인' })
  @ApiResponse({ status: 302, description: '홈으로 리다이렉션' })
  @ApiResponse({ status: 401 })
  @UseGuards(GitHubAuthGuard)
  githubAuth() {}

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  githubAuthCallback(@GetUserId() userId: number, @Res() response: Response) {
    this.cookieInsertJWT(response, userId);
  }

  private setAuthCookie(response: Response, accessToken: string) {
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  private async cookieInsertJWT(
    response: Response,
    userId: number,
    redirectUrl: string = this.configService.get<string>('LOGIN_REDIRECT_URL')
  ) {
    const { accessToken } = await this.authService.createJWT(userId);
    this.setAuthCookie(response, accessToken);
    response.redirect(redirectUrl);
  }
}
