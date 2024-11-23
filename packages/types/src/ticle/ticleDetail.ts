import { z } from 'zod';
import { TicleStatus } from './ticleStatus';

export const TicleDetailResponseSchema = z.object({
  id: z.number(),
  speakerName: z.string(),
  speakerEmail: z.string().email(),
  speakerIntroduce: z.string(),
  title: z.string(),
  content: z.string(),
  startTime: z.string().date(),
  endTime: z.string().date(),
  ticleStatus: z.enum([TicleStatus.CLOSED, TicleStatus.OPEN]),
  createdAt: z.string().date(),
  tags: z.array(z.string()),
  speakerImgUrl: z.string().url(),
});

export type TicleDetailResponse = z.infer<typeof TicleDetailResponseSchema>;
