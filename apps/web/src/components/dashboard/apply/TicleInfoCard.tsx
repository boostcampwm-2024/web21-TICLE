import { Link } from '@tanstack/react-router';

import Button from '@/components/common/Button';
import { formatDateTimeRange } from '@/utils/date';

interface TicleInfoCardProps {
  ticleId: number;
  ticleOwner: string;
  ticleTitle: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'completed';
}

function TicleInfoCard({
  ticleId,
  ticleOwner,
  ticleTitle,
  startTime,
  endTime,
  status,
}: TicleInfoCardProps) {
  const { dateStr, timeRangeStr } = formatDateTimeRange(startTime, endTime);

  return (
    <div className="flex items-center justify-between rounded-lg border border-main bg-white p-6 shadow-normal">
      <div className="flex gap-5">
        <div className="flex gap-3">
          <h3 className="text-title2 text-main">개설자</h3>
          <span className="text-body3 text-main">{ticleOwner}</span>
        </div>
        <div className="flex gap-3">
          <h3 className="text-title2 text-main">티클명</h3>
          <span className="text-body3 text-main">{ticleTitle}</span>
        </div>
        <div className="flex gap-3">
          <h3 className="text-title2 text-main">진행 일시</h3>
          <span className="text-body3 text-main">{`${dateStr} ${timeRangeStr}`}</span>
        </div>
      </div>
      <Link to={`/live/${ticleId}`}>
        <Button disabled={status === 'completed'}>티클 참여하기</Button>
      </Link>
    </div>
  );
}

export default TicleInfoCard;
