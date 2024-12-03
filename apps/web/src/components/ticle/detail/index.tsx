import { useNavigate, useParams } from '@tanstack/react-router';

import CalendarIc from '@/assets/icons/calendar.svg?react';
import ClockIc from '@/assets/icons/clock.svg?react';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import UserProfileDialog from '@/components/user/UserProfileDialog';
import { useApplyTicle, useDeleteTicle, useTicle } from '@/hooks/api/ticle';
import useModal from '@/hooks/useModal';
import useAuthStore from '@/stores/useAuthStore';
import { formatDateTimeRange } from '@/utils/date';

import CtaButton from './CtaButton';

function Detail() {
  const { ticleId } = useParams({ from: '/ticle/$ticleId' });
  const userId = useAuthStore.getState().authInfo?.userId;
  const { data } = useTicle(ticleId, userId || '');
  const { mutate: applyMutate } = useApplyTicle();
  const { mutate: deleteMutate } = useDeleteTicle();

  const handleApplyButtonClick = () => {
    applyMutate(ticleId);
  };

  const handleDeleteButtonClick = () => {
    deleteMutate(ticleId);
  };

  const { isOpen, onOpen, onClose } = useModal();
  const handleProfileClick = () => {
    onOpen();
  };

  if (!data) return;
  const { dateStr, timeRangeStr } = formatDateTimeRange(data.startTime, data.endTime);
  return (
    <div className="flex flex-col items-end gap-9">
      <div className="flex w-[49.5rem] flex-col gap-9 rounded-lg border border-main bg-white p-10 shadow-normal">
        <div className="flex flex-col gap-2">
          <h1 className="w-full text-head1 text-main">{data.title}</h1>
          <div className="flex gap-2.5">
            {data.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-head3 text-main">티클 진행 일정</h3>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <CalendarIc className="fill-primary" />
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
          <article className="whitespace-pre-line text-body1 text-main">{data.content}</article>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-head3 text-main">발표자 소개</h3>
          <div className="flex gap-8">
            <div
              className="flex cursor-pointer flex-col items-center gap-3"
              onClick={handleProfileClick}
            >
              <Avatar size="lg" src={data.speakerImgUrl} />
              <span className="text-title2 text-main">{data.speakerName}</span>
            </div>
            {isOpen && (
              <UserProfileDialog
                isOpen={isOpen}
                onClose={onClose}
                speakerId={data.speakerId}
                nickname={data.speakerName}
              />
            )}
            <div className="w-full rounded-lg bg-teritary p-4 text-body2 text-main">
              {data.speakerIntroduce}
            </div>
          </div>
        </div>
      </div>
      <CtaButton
        isOwner={data.isOwner}
        alreadyApplied={data.alreadyApplied}
        ticleStatus={data.ticleStatus}
        onApply={handleApplyButtonClick}
        onDelete={handleDeleteButtonClick}
      />
    </div>
  );
}

export default Detail;
