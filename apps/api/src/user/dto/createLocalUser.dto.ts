import { Provider } from '@repo/types';

export class CreateLocalUserDto {
  username: string;
  password: string;
  email: string;
  provider: Provider;
  nickname?: string;
  introduce?: string;
  profileImageUrl?: string;
}
