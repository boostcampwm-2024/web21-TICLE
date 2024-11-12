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

  @ApiProperty({ example: "Hello, I'm user", required: false })
  introduce?: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg', required: false })
  profileImageUrl?: string;

  @ApiProperty({ example: 'local', required: false })
  provider?: string;

  @ApiProperty({ example: 'null', required: false })
  socialId?: string;
}
