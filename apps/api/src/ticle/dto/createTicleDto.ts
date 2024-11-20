import { ApiProperty } from '@nestjs/swagger';
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
    .refine((items) => new Set(items).size === items.length, '중복된 태그는 사용할 수 없습니다'),
});

export type CreateTicleType = z.infer<typeof CreateTicleSchema>;

export class CreateTicleDto implements CreateTicleType {
  @ApiProperty({
    example: '김철수',
    description: '발표자 이름',
  })
  speakerName: string;

  @ApiProperty({
    example: 'kim@example.com',
    description: '발표자 이메일',
  })
  speakerEmail: string;

  @ApiProperty({
    example: '10년차 프론트엔드 개발자이며 현재 네이버에서 근무중입니다.',
    description: '발표자 소개',
  })
  speakerIntroduce: string;

  @ApiProperty({
    example: '모던 리액트와 상태관리 전략',
    description: '발표 제목',
  })
  title: string;

  @ApiProperty({
    example:
      '이번 세션에서는 React 18의 새로운 기능과 효과적인 상태관리 방법에 대해 다루겠습니다. Redux, Recoil, Zustand 등 다양한 상태관리 라이브러리의 장단점을 비교해보고, 실제 프로젝트에서의 적용 사례를 공유하겠습니다.',
    description: '발표 내용',
  })
  content: string;

  @ApiProperty({
    example: '2024-12-01T14:00:00.000Z',
    description: '발표 시작 시간',
  })
  startTime: Date;

  @ApiProperty({
    example: '2024-12-01T16:00:00.000Z',
    description: '발표 종료 시간',
  })
  endTime: Date;

  @ApiProperty({
    example: ['React', 'Frontend', 'State Management'],
    description: '발표 관련 태그',
    type: [String],
    required: false,
  })
  tags: string[];
}
