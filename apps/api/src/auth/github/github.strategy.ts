import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Profile, Strategy, StrategyOption } from 'passport-github2';
import { Provider } from '@repo/types';

import { AuthService } from '../auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, Provider.github) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get<string>('AUTHGITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('AUTHGITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('AUTHGITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }
  authenticate(req: Request, options: StrategyOption) {
    const returnUrl = req.query.redirect as string;
    if (returnUrl) {
      options.state = returnUrl;
    }
    return super.authenticate(req, options);
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, username, emails, photos } = profile;

    const user = {
      provider: Provider.github,
      socialId: id,
      nickname: username,
      email: emails[0].value,
      profileImageUrl: photos?.[0]?.value,
    };
    const socialUser = await this.authService.checkSocialUser(user);
    return { id: socialUser.id };
  }
}
