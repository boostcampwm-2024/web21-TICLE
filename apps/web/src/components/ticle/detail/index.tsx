import CalendarIc from '@/assets/icons/calendar.svg?react';
import ClockIc from '@/assets/icons/clock.svg?react';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { formatDateTimeRange, formateDateTime } from '@/utils/date';

const DATA = {
  speakerName: '김철수',
  speakerEmail: 'kim@example.com',
  speakerIntroduce: '10년차 프론트엔드 개발자이며 현재 네이버에서 근무중입니다.',
  title: '모던 리액트와 상태관리 전략',
  content:
    '이번 세션에서는 React 18의 새로운 기능과 효과적인 상태관리 방법에 대해 다루겠습니다. Redux, Recoil, Zustand 등 다양한 상태관리 라이브러리의 장단점을 비교해보고, 실제 프로젝트에서의 적용 사례를 공유하겠습니다.\n이번 세션에서는 React 18의 새로운 기능과 효과적인 상태관리 방법에 대해 다루겠습니다. Redux, Recoil, Zustand 등 다양한 상태관리 라이브러리의 장단점을 비교해보고, 실제 프로젝트에서의 적용 사례를 공유하겠습니다.\n이번 세션에서는 React 18의 새로운 기능과 효과적인 상태관리 방법에 대해 다루겠습니다. Redux, Recoil, Zustand 등 다양한 상태관리 라이브러리의 장단점을 비교해보고, 실제 프로젝트에서의 적용 사례를 공유하겠습니다.',
  startTime: '2024-12-01T14:00:00.000Z',
  endTime: '2024-12-01T16:00:00.000Z',
  tags: ['React', 'Frontend', 'Nest'],
};

function Detail() {
  const { dateStr, timeRangeStr } = formatDateTimeRange(DATA.startTime, DATA.endTime);
  return (
    <div className="flex flex-col items-end gap-9">
      <div className="surface-white flex w-[49.5rem] flex-col gap-9 rounded-lg border border-main p-10 shadow-normal">
        <div className="flex flex-col gap-2">
          <h1 className="w-full text-head1 text-main">{DATA.title}</h1>
          <div className="flex gap-2.5">
            {DATA.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-head3 text-main">티클 진행 일정</h3>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <CalendarIc />
              {dateStr}
            </div>
            <div className="flex gap-2">
              <ClockIc />
              {timeRangeStr}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-head3 text-main">티클 상세 설명</h3>
          <article className="whitespace-pre-line text-body1 text-main">{DATA.content}</article>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-head3 text-main">발표자 소개</h3>
          <div className="flex gap-8">
            <div className="flex flex-col items-center gap-3">
              <Avatar size="lg" />
              <span className="text-title2 text-main">{DATA.speakerName}</span>
            </div>
            <div className="w-full rounded-lg bg-teritary p-4 text-body2 text-main">
              {DATA.speakerIntroduce}
            </div>
          </div>
        </div>
      </div>
      <Button>티클 신청하기</Button>
    </div>
  );
}

export default Detail;
