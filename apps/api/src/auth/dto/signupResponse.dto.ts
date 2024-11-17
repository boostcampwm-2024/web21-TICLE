import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseDto {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({
    example: {
      id: '1',
      username: 'jongbin',
      nickname: 'JB',
      email: 'jongbin@example.com',
      introduce: "Hello, I'm Jongbin",
      profileImageUrl: 'https://example.com/profile.jpg',
      provider: 'local',
      socialId: 'null',
      createdAt: '2024-11-10T17:11:08.448Z',
      updatedAt: '2024-11-10T17:11:08.448Z',
    },
  })
  data: any;
}
