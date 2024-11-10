import { ApiProperty } from '@nestjs/swagger';

export class LocalLoginRequestDto {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'password123' })
  data: any;
}
