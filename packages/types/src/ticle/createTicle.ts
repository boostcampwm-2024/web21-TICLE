import { z } from 'zod';

export const CreateTicleSchema = z.object({
  speakerName: z
    .string()
    .min(1, '발표자 이름은 필수입니다.')
    .max(7, '발표자 이름은 7자 이내여야 합니다.'),

  speakerEmail: z.string().min(1, '이메일은 필수입니다.').email('올바른 이메일 형식이 아닙니다.'),

  speakerIntroduce: z
    .string()
    .min(1, '자기소개는 필수입니다.')
    .max(500, '자기소개는 500자 이내여야 합니다.'),

  title: z.string().min(1, '티클 제목은 필수입니다.').max(30, '티클 제목은 30자 이내여야 합니다.'),

  content: z
    .string()
    .min(1, '티클 상세 설명은 필수입니다.')
    .max(1500, '티클 상세 설명은 1500자 이내여야 합니다.'),

  startTime: z.coerce
    .date()
    .or(z.undefined())
    .refine((date) => date !== undefined, '시작 시간은 필수입니다.')
    .refine((date) => date > new Date(), '시작 시간은 현재 시간 이후여야 합니다.'),

  endTime: z.coerce
    .date()
    .or(z.undefined())
    .refine((date) => date !== undefined, '종료 시간은 필수입니다.')
    .refine((date) => date > new Date(), '종료 시간은 현재 시간 이후여야 합니다.'),

  tags: z
    .array(z.string())
    .min(1, '최소 1개 이상의 해시태그가 필요합니다.')
    .max(4, '해시태그는 최대 4개까지 가능합니다.')
    .refine((items) => new Set(items).size === items.length, '중복된 태그는 사용할 수 없습니다.')
    .optional(),
});

export type CreateTicleType = z.infer<typeof CreateTicleSchema>;

export const CreateTicleFormSchema = CreateTicleSchema.extend({
  hashtagInput: z.string().max(7, '해시태그는 최대 7자까지 가능합니다.').optional(),
});

export type CreateTicleFormType = z.infer<typeof CreateTicleFormSchema>;
