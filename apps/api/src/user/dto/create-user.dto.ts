export class CreateUserDto {
  username: string;
  password: string;
  nickname: string;
  email: string;
  introduce: string;
  profileImageUrl: string;
  provider: string;
  socialId: string;
}
