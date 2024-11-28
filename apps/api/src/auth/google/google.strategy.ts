import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Provider } from '@repo/types';

import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, Provider.google) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  authenticate(req: any, options: any) {
    const returnUrl = req.query.redirect;
    if (returnUrl) {
      options = options || {};
      options.state = returnUrl;
    }
    return super.authenticate(req, options);
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
    const { id, displayName, emails, photos } = profile;

    const user = {
      provider: Provider.google,
      socialId: id,
      nickname: displayName,
      email: emails[0].value,
      profileImageUrl: photos[0].value,
    };

    const socialUser = await this.authService.checkSocialUser(user);
    return { id: socialUser.id };
  }
}
