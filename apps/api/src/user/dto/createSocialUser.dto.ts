import { Provider } from '@repo/types';

export class CreateSocialUserDto {
  email: string;
  provider: Provider;
  socialId: string;
  nickname?: string;
  introduce?: string;
  profileImageUrl?: string;
}
