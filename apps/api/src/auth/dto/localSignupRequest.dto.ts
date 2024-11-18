import { ApiProperty } from '@nestjs/swagger';

export class LocalSignupRequestDto {
  @ApiProperty({ example: 'userName' })
  username: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'nickname' })
  nickname?: string;

  @ApiProperty({ example: "Hello, I'm user", required: false })
  introduce?: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg', required: false })
  profileImageUrl?: string;
}
