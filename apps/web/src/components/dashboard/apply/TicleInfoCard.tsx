import { Link, useNavigate } from '@tanstack/react-router';
import { MouseEvent } from 'react';

import AiSummaryIc from '@/assets/icons/ai-summary.svg?react';
import Button from '@/components/common/Button';
import useModal from '@/hooks/useModal';
import { formatDateTimeRange } from '@/utils/date';

import AiSummaryDialog from '../AiSummaryDialog';

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
  const { isOpen, onOpen, onClose } = useModal();
  const { dateStr, timeRangeStr } = formatDateTimeRange(startTime, endTime);
  const navigate = useNavigate();

  const handleTicleParticipate = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate({ to: `/live/${ticleId}` });
  };

  const handleAiSummaryDialogOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onOpen();
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
        <div className="flex gap-9">
          {status === 'closed' && (
            <button
              className="flex items-center gap-2 rounded-md p-2.5 hover:bg-teritary"
              onClick={handleAiSummaryDialogOpen}
            >
              <span className="text-title2 text-primary">AI 음성 요약</span>
              <div>
                <AiSummaryIc className="fill-primary" />
              </div>
            </button>
          )}
          <Button
            disabled={status === 'closed' || status === 'open'}
            onClick={handleTicleParticipate}
            className="w-36"
          >
            {status === 'closed'
              ? '종료된 티클'
              : status === 'inProgress'
                ? '티클 참여하기'
                : '티클 시작 전'}
          </Button>
        </div>
        {isOpen && (
          <AiSummaryDialog onClose={onClose} isOpen={isOpen} ticleId={ticleId.toString()} />
        )}
      </div>
    </Link>
  );
}

export default TicleInfoCard;
