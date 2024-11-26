import { z } from 'zod';

const TicleSchema = z.object({
  id: z.number(),
  title: z.string(),
  tags: z.array(z.string()),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  speakerName: z.string(),
  applicantsCount: z.number(),
  createdAt: z.string().datetime(),
  speakerProfileImageUrl: z.string().url(),
});

const MetaSchema = z.object({
  page: z.number(),
  take: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
});

export const TicleListResponseSchema = z.object({
  ticles: z.array(TicleSchema),
  meta: MetaSchema,
});

export type TicleListResponse = z.infer<typeof TicleListResponseSchema>;
