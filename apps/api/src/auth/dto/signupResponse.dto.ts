import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseDto {
  @ApiProperty({ example: '1' })
  id: number;
  @ApiProperty({ example: 'userName' })
  username: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'nickname' })
  nickname: string;

  @ApiProperty({ example: "Hello, I'm user", required: false })
  introduce: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg', required: false })
  profileImageUrl: string;

  @ApiProperty({ example: 'local' })
  provider: string;

  @ApiProperty({ example: 'null' })
  socialId: string;

  @ApiProperty({ example: '2024-11-10T17:11:08.448Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-11-10T17:11:08.448Z' })
  updatedAt: Date;
}
