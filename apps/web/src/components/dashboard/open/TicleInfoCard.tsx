import { Link, useNavigate } from '@tanstack/react-router';
import { MouseEvent } from 'react';

import PersonFilledIc from '@/assets/icons/person-filled.svg?react';
import Button from '@/components/common/Button';
import { useApplicantsTicle } from '@/hooks/api/dashboard';
import useModal from '@/hooks/useModal';
import { formatDateTimeRange } from '@/utils/date';

import ApplicantsDialog from './ApplicantsDialog';

interface TicleInfoCardProps {
  ticleId: number;
  ticleTitle: string;
  startTime: string;
  endTime: string;
  status: 'closed' | 'open';
}

function TicleInfoCard({ ticleId, ticleTitle, startTime, endTime, status }: TicleInfoCardProps) {
  const { isOpen, onOpen, onClose } = useModal();

  const { data: applicantsData } = useApplicantsTicle(ticleId.toString());
  const { dateStr, timeRangeStr } = formatDateTimeRange(startTime, endTime);

  const navigate = useNavigate();

  if (!applicantsData) return;

  const handleTicleParticipate = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate({ to: `/live/${ticleId}` });
  };

  const handleApplicantsDialogOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onOpen();
  };

  return (
    <Link to={`/ticle/${ticleId}`}>
      <div className="flex items-center justify-between rounded-lg border border-main bg-white p-6 shadow-normal">
        <div className="flex gap-5">
          <div className="flex items-center gap-3">
            <h3 className="text-title2 text-main">티클명</h3>
            <span className="w-80 text-body1 text-main">{ticleTitle}</span>
          </div>
          <div className="flex items-center gap-3">
            <h3 className="text-title2 text-main">진행 일시</h3>
            <span className="text-body1 text-main">{`${dateStr} ${timeRangeStr}`}</span>
          </div>
        </div>
        <div className="flex gap-9">
          <button
            className="flex items-center gap-2 rounded-md p-2.5 hover:bg-teritary"
            onClick={handleApplicantsDialogOpen}
          >
            <span className="text-title2 text-primary">신청자 목록</span>

            <div>
              <PersonFilledIc className="fill-primary" />
            </div>
          </button>
          <Button disabled={status === 'closed'} onClick={handleTicleParticipate}>
            티클 시작하기
          </Button>
        </div>
        {isOpen && (
          <ApplicantsDialog onClose={onClose} isOpen={isOpen} applicants={applicantsData} />
        )}
      </div>
    </Link>
  );
}

export default TicleInfoCard;
