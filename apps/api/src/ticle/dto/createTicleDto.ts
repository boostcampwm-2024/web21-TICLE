import { ApiProperty } from '@nestjs/swagger';

export class CreateTicleDto {
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
    example: ['React', 'Frontend', 'State Management', 'Nest', 'Web Development'],
    description: '발표 관련 태그',
    type: [String],
    required: false,
  })
  tags?: string[];
}
