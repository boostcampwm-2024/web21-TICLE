import { z } from 'zod';

import { TicleStatus } from './ticleStatus';

export const TicleDetailResponseSchema = z.object({
  id: z.number(),
  speakerName: z.string(),
  speakerEmail: z.string().email(),
  speakerIntroduce: z.string(),
  title: z.string(),
  content: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  ticleStatus: z.enum([TicleStatus.CLOSED, TicleStatus.OPEN]),
  createdAt: z.string().datetime(),
  tags: z.array(z.string()),
  speakerImgUrl: z.string().url(),
});

export type TicleDetailResponse = z.infer<typeof TicleDetailResponseSchema>;
