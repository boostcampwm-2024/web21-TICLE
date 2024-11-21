export class CreateLocalUserDto {
  username: string;
  password: string;
  email: string;
  provider: string;
  nickname?: string;
  introduce?: string;
  profileImageUrl?: string;
}
