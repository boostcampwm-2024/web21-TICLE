import { ApiProperty } from '@nestjs/swagger';

export class LocalLoginResponseDto {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiI...',
    },
  })
  data: any;
}
