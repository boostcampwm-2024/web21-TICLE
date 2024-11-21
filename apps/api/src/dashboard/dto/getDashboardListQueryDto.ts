import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { TicleStatus } from '@/entity/ticle.entity';

export const GetDashboardListQuerySchema = z.object({
  isSpeaker: z.enum(['true', 'false']).transform((val) => val === 'true'),
  page: z
    .number()
    .optional()
    .default(1)
    .refine((val) => val > 0, '페이지 번호는 0보다 커야 합니다'),
  pageSize: z
    .number()
    .optional()
    .default(10)
    .refine((val) => val > 0, '페이지 크기는 0보다 커야 합니다'),
  status: z
    .nativeEnum(TicleStatus)
    .optional()
    .refine((val) => Object.values(TicleStatus).includes(val), '유효하지 않은 상태 값입니다'),
});

export type GetDashboardListQueryType = z.infer<typeof GetDashboardListQuerySchema>;

export class GetDashboardListQueryDto implements GetDashboardListQueryType {
  @ApiProperty({ example: true, description: '발표자인지 여부' })
  isSpeaker: boolean;

  @ApiProperty({ example: 1, description: '페이지 번호', default: 1 })
  page?: number;

  @ApiProperty({ example: 10, description: '페이지 크기', default: 10 })
  pageSize?: number;

  @ApiProperty({
    example: TicleStatus.OPEN,
    description: '티클 상태 (open 또는 closed)',
  })
  status?: TicleStatus;
}
