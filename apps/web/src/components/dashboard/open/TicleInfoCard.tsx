import { Link } from '@tanstack/react-router';

import PersonFilledIc from '@/assets/icons/person-filled.svg?react';
import Button from '@/components/common/Button';
import { formatDateTimeRange } from '@/utils/date';

interface TicleInfoCardProps {
  ticleId: number;
  ticleTitle: string;
  startTime: string;
  endTime: string;
  status: 'closed' | 'open';
}

function TicleInfoCard({ ticleId, ticleTitle, startTime, endTime, status }: TicleInfoCardProps) {
  const { dateStr, timeRangeStr } = formatDateTimeRange(startTime, endTime);

  return (
    <div className="flex items-center justify-between rounded-lg border border-main bg-white p-6 shadow-normal">
      <div className="flex gap-5">
        <div className="flex gap-3">
          <h3 className="text-title2 text-main">티클명</h3>
          <span className="w-72 text-body3 text-main">{ticleTitle}</span>
        </div>
        <div className="flex gap-3">
          <h3 className="text-title2 text-main">진행 일시</h3>
          <span className="text-body3 text-main">{`${dateStr} ${timeRangeStr}`}</span>
        </div>
      </div>
      <div>
        <button className="flex gap-2 rounded-md p-2.5 hover:bg-teritary">
          <span>신청자 목록</span>
          <div>
            <PersonFilledIc className="fill-primary" />
          </div>
        </button>
        <Link to={`/live/${ticleId}`}>
          <Button disabled={status === 'closed'}>티클 시작하기</Button>
        </Link>
      </div>
    </div>
  );
}

export default TicleInfoCard;
