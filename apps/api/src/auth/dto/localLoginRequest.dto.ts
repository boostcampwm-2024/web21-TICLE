import { ApiProperty } from '@nestjs/swagger';

export class LocalLoginRequestDto {
  @ApiProperty({ example: 'username' })
  username: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}
