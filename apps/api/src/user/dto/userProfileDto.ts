import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    example: '1',
    description: '유저 아이디',
  })
  id: number;

  @ApiProperty({
    example: 'simeunseo',
    description: '유저 닉네임',
  })
  nickname: string;

  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/55528304?v=4',
    description: '유저 프로필 사진',
  })
  profileImageUrl: string;

  @ApiProperty({
    example: 'github',
    description: '유저 소셜 로그인 프로바이더',
  })
  provider: string;
}
