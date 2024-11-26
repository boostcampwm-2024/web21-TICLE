import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { SortType } from '../sortType.enum';

export class GetTicleListQueryDto {
  @ApiProperty({
    example: 1,
    description: '페이지 번호',
    default: 1,
    required: false,
  })
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: '페이지당 항목 수',
    default: 10,
    required: false,
  })
  pageSize?: number = 10;

  @ApiProperty({
    example: true,
    description: '개설되어 있는 티클 여부',
    default: true,
    required: false,
  })
  @Transform(({ value }) => value === 'true')
  isOpen?: boolean;

  @ApiProperty({
    enum: SortType,
    enumName: 'SortType',
    description: '정렬 기준 (newest: 최신순, oldest: 오래된순, trending: 참여자 많은순)',
    default: SortType.NEWEST,
    required: false,
  })
  sort?: SortType = SortType.NEWEST;
}
