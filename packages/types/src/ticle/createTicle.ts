import { z } from 'zod';

export const CreateTicleSchema = z.object({
  speakerName: z.string().min(1, '발표자 이름은 필수입니다').max(10, '발표자 이름이 너무 깁니다'),

  speakerEmail: z.string().min(1, '이메일은 필수입니다').email('올바른 이메일 형식이 아닙니다'),

  speakerIntroduce: z
    .string()
    .min(10, '발표자 소개는 최소 10자 이상이어야 합니다')
    .max(500, '발표자 소개가 너무 깁니다'),

  title: z.string().min(1, '발표 제목은 필수입니다').max(100, '제목이 너무 깁니다'),

  content: z
    .string()
    .min(1, '발표 내용은 최소 10자 이상이어야 합니다')
    .max(1500, '발표 내용이 너무 깁니다'),

  startTime: z.coerce
    .date()
    .refine((date) => date > new Date(), '시작 시간은 현재 시간 이후여야 합니다'),

  endTime: z.coerce
    .date()
    .refine((date) => date > new Date(), '종료 시간은 현재 시간 이후여야 합니다'),

  tags: z
    .array(z.string())
    .min(1, '최소 1개 이상의 태그가 필요합니다')
    .max(4, '태그는 최대 4개까지 가능합니다')
    .refine((items) => new Set(items).size === items.length, '중복된 태그는 사용할 수 없습니다')
    .optional(),
});

export type CreateTicleType = z.infer<typeof CreateTicleSchema>;

export const CreateTicleFormSchema = CreateTicleSchema.extend({
  hashtagInput: z.string().max(7, '태그는 최대 7자까지 가능합니다').optional(),
});

export type CreateTicleFormType = z.infer<typeof CreateTicleFormSchema>;
