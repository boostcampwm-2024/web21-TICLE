import { z } from 'zod';

import { TicleStatus } from '../ticle/ticleStatus';

export const GetDashboardListQuerySchema = z.object({
  isSpeaker: z.enum(['true', 'false']).transform((val) => val === 'true'),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val > 0, '페이지 번호는 0보다 커야 합니다'),
  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => !isNaN(val) && val > 0, '페이지 크기는 0보다 커야 합니다'),
  status: z.enum([TicleStatus.CLOSED, TicleStatus.OPEN]).nullable().optional(),
});

export type GetDashboardListQueryType = z.infer<typeof GetDashboardListQuerySchema>;
