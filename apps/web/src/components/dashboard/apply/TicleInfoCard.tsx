import { Link, useNavigate } from '@tanstack/react-router';
import { MouseEvent } from 'react';

import Button from '@/components/common/Button';
import { formatDateTimeRange } from '@/utils/date';

interface TicleInfoCardProps {
  ticleId: number;
  speakerName: string;
  ticleTitle: string;
  startTime: string;
  endTime: string;
  status: 'closed' | 'open' | 'inProgress';
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
  const navigate = useNavigate();

  const handleTicleParticipate = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate({ to: `/live/${ticleId}` });
  };

  return (
    <Link to={`/ticle/${ticleId}`}>
      <div className="flex items-center justify-between rounded-lg border border-main bg-white p-6 shadow-normal">
        <div className="flex gap-5">
          <div className="flex items-center gap-3">
            <h3 className="text-title2 text-main">개설자</h3>
            <span className="w-36 text-body1 text-main">{speakerName}</span>
          </div>
          <div className="flex items-center gap-3">
            <h3 className="text-title2 text-main">티클명</h3>
            <span className="w-80 overflow-hidden text-ellipsis whitespace-pre text-body1 text-main">
              {ticleTitle}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h3 className="text-title2 text-main">진행 일시</h3>
            <span className="text-body1 text-main">{`${dateStr} ${timeRangeStr}`}</span>
          </div>
        </div>
        <Button disabled={status === 'closed'} onClick={handleTicleParticipate}>
          {status === 'closed' ? '종료된 티클' : '티클 참여하기'}
        </Button>
      </div>
    </Link>
  );
}

export default TicleInfoCard;
