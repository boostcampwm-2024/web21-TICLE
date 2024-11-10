import { ApiProperty } from '@nestjs/swagger';

export class LocalLoginResponseDto {
  @ApiProperty({ example: 'username' })
  username: string;

  @ApiProperty({
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiI...',
    },
  })
  password: string;
}
