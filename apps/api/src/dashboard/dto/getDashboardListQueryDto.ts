import { ApiProperty } from '@nestjs/swagger';
import { TicleStatus, GetDashboardListQueryType } from '@repo/types';

export class GetDashboardListQueryDto implements GetDashboardListQueryType {
  @ApiProperty({ example: true, description: '발표자인지 여부' })
  isSpeaker: boolean;

  @ApiProperty({ example: 1, description: '페이지 번호', default: 1 })
  page: number;

  @ApiProperty({ example: 10, description: '페이지 크기', default: 10 })
  pageSize: number;

  @ApiProperty({
    example: TicleStatus.OPEN,
    description: '티클 상태 (open 또는 closed)',
  })
  status?: TicleStatus;
}
