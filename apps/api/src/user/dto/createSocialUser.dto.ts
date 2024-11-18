export class CreateSocialUserDto {
  email: string;
  provider: string;
  socialId: string;
  nickname?: string;
  introduce?: string;
  profileImageUrl?: string;
}
