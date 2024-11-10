import { ApiProperty } from '@nestjs/swagger';

export class SignupRequestDto {
  @ApiProperty({ example: 'userName' })
  username: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ example: 'nickname' })
  nickname: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: "Hello, I'm user" })
  introduce: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg' })
  profileImageUrl: string;

  @ApiProperty({ example: 'local' })
  provider: string;

  @ApiProperty({ example: 'null' })
  socialId: string;
}
