import { Link } from '@tanstack/react-router';

import Button from '@/components/common/Button';
import { formatDateTimeRange } from '@/utils/date';

interface TicleInfoCardProps {
  ticleId: number;
  speakerName: string;
  ticleTitle: string;
  startTime: string;
  endTime: string;
  status: 'closed' | 'open';
}

function TicleInfoCard({
  ticleId,
  speakerName,
  ticleTitle,
  startTime,
  endTime,
  status,
}: TicleInfoCardProps) {
  const { dateStr, timeRangeStr } = formatDateTimeRange(startTime, endTime);

  return (
    <div className="flex items-center justify-between rounded-lg border border-main bg-white p-6 shadow-normal">
      <div className="flex gap-5">
        <div className="flex items-center gap-3">
          <h3 className="text-title2 text-main">개설자</h3>
          <span className="w-36 text-body1 text-main">{speakerName}</span>
        </div>
        <div className="flex items-center gap-3">
          <h3 className="text-title2 text-main">티클명</h3>
          <span className="w-80 text-body1 text-main">{ticleTitle}</span>
        </div>
        <div className="flex items-center gap-3">
          <h3 className="text-title2 text-main">진행 일시</h3>
          <span className="text-body1 text-main">{`${dateStr} ${timeRangeStr}`}</span>
        </div>
      </div>
      <Link to={`/live/${ticleId}`}>
        <Button disabled={status === 'closed'}>티클 참여하기</Button>
      </Link>
    </div>
  );
}

export default TicleInfoCard;
