import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';

import { GetUserId } from '@/common/decorator/get-userId.decorator';
import { CookieConfig } from '@/config/cookie.config';

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
  private readonly redirectUrl: string;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly cookieConfig: CookieConfig
  ) {
    this.redirectUrl = this.configService.get<string>('LOGIN_REDIRECT_URL');
  }

  @Post('signup')
  @ApiOperation({ summary: '로컬 회원가입' })
  @ApiResponse({ status: 201, type: SignupResponseDto })
  @ApiResponse({ status: 409 })
  async signup(@Body() createUserDto: LocalSignupRequestDto): Promise<SignupResponseDto> {
    const user = await this.authService.signupLocal(createUserDto);
    return user;
  }

  @Post('login')
  @ApiOperation({ summary: '로컬 로그인' })
  @ApiBody({ type: LocalLoginRequestDto })
  @ApiResponse({ status: 302, description: '홈으로 리다이렉션' })
  @ApiResponse({ status: 401 })
  @UseGuards(LocalAuthGuard)
  localLogin(
    @GetUserId() userId: number,
    @Query('state') state: string,
    @Res() response: Response
  ) {
    this.loginProcess(response, userId, state);
  }

  @Get('guest/login')
  @ApiOperation({ summary: '게스트 로그인' })
  @ApiResponse({ status: 302, description: '홈으로 리다이렉션' })
  @UseGuards(ThrottlerGuard)
  async guestLogin(@Query('state') state: string, @Res() response: Response) {
    const guestUser = await this.authService.createGuestUser();
    this.loginProcess(response, guestUser.id, state);
  }

  @Get('google/login')
  @ApiOperation({ summary: '구글 OAuth 로그인' })
  @ApiResponse({ status: 302, description: '홈으로 리다이렉션' })
  @ApiResponse({ status: 401 })
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthCallback(
    @GetUserId() userId: number,
    @Query('state') state: string,
    @Res() response: Response
  ) {
    this.loginProcess(response, userId, state);
  }

  @Get('github/login')
  @ApiOperation({ summary: '깃허브 OAuth 로그인' })
  @ApiResponse({ status: 302, description: '홈으로 리다이렉션' })
  @ApiResponse({ status: 401 })
  @UseGuards(GitHubAuthGuard)
  githubAuth() {}

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  githubAuthCallback(
    @GetUserId() userId: number,
    @Query('state') state: string,
    @Res() response: Response
  ) {
    this.loginProcess(response, userId, state);
  }

  @Get('logout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: 302, description: '홈으로 리다이렉션' })
  logout(@Res() response: Response) {
    response.clearCookie('accessToken', this.cookieConfig.getAuthCookieOptions());
    this.redirectToHome(response);
  }

  private loginProcess(response: Response, userId: number, redirectUrl: string) {
    const { accessToken } = this.authService.createJWT(userId);
    response.cookie('accessToken', accessToken, this.cookieConfig.getAuthCookieOptions());
    this.redirectToHome(response, redirectUrl);
  }

  private redirectToHome(response: Response, redirectUrl = this.redirectUrl) {
    response.redirect(redirectUrl);
  }
}
