export class CreateUserDto {
  username: string;
  password: string;
  email: string;
  nickname?: string;
  introduce?: string;
  profileImageUrl?: string;
  provider?: string;
  socialId?: string;
}
