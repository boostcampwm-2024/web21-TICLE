import { Link, useNavigate } from '@tanstack/react-router';
import { MouseEvent } from 'react';

import AiSummaryIc from '@/assets/icons/ai-summary.svg?react';
import PersonFilledIc from '@/assets/icons/person-filled.svg?react';
import Button from '@/components/common/Button';
import { useApplicantsTicle, useStartTicle } from '@/hooks/api/dashboard';
import useModal from '@/hooks/useModal';
import { formatDateTimeRange } from '@/utils/date';

import ApplicantsDialog from './ApplicantsDialog';
import AiSummaryDialog from '../AiSummaryDialog';

interface TicleInfoCardProps {
  ticleId: number;
  ticleTitle: string;
  startTime: string;
  endTime: string;
  status: 'closed' | 'open' | 'inProgress';
  isSummaryExist: boolean;
}

function TicleInfoCard({
  ticleId,
  ticleTitle,
  startTime,
  endTime,
  status,
  isSummaryExist,
}: TicleInfoCardProps) {
  const {
    isOpen: isApplicantsDialogOpen,
    onOpen: onApplicantsDialogOpen,
    onClose: onApplicantsDialogClose,
  } = useModal();

  const {
    isOpen: isAiSummaryDialogOpen,
    onOpen: onAiSummaryDialogOpen,
    onClose: onAiSummaryDialogClose,
  } = useModal();

  const { mutate: ticleStartMutate } = useStartTicle();
  const { dateStr, timeRangeStr } = formatDateTimeRange(startTime, endTime);

  const navigate = useNavigate();

  const handleTicleStart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    ticleStartMutate(ticleId.toString());
    navigate({ to: `/live/${ticleId}` });
  };

  const handleApplicantsDialogOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onApplicantsDialogOpen();
  };

  const handleAiSummaryDialogOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onAiSummaryDialogOpen();
  };

  return (
    <Link to={`/ticle/${ticleId}`}>
      <div className="flex items-center justify-between rounded-lg border border-main bg-white p-6 shadow-normal">
        <div className="flex gap-5">
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
          {status === 'closed' && isSummaryExist && (
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
          <button
            className="flex items-center gap-2 rounded-md p-2.5 hover:bg-teritary"
            onClick={handleApplicantsDialogOpen}
          >
            <span className="text-title2 text-primary">신청자 목록</span>

            <div>
              <PersonFilledIc className="fill-primary" />
            </div>
          </button>
          <Button
            disabled={status === 'closed' || status === 'inProgress'}
            onClick={handleTicleStart}
            className="w-36"
          >
            {status === 'closed'
              ? '종료된 티클'
              : status === 'inProgress'
                ? '시작된 티클'
                : '티클 시작하기'}
          </Button>
        </div>
        {isApplicantsDialogOpen && (
          <ApplicantsDialog
            ticleId={ticleId}
            onClose={onApplicantsDialogClose}
            isOpen={isApplicantsDialogOpen}
          />
        )}
        {isAiSummaryDialogOpen && (
          <AiSummaryDialog
            onClose={onAiSummaryDialogClose}
            isOpen={isAiSummaryDialogOpen}
            ticleId={ticleId.toString()}
          />
        )}
      </div>
    </Link>
  );
}

export default TicleInfoCard;
