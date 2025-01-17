import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';

import ControlBar from '@/components/live/ControlBar';
import StreamView from '@/components/live/StreamView';
import { toast } from '@/core/toast';
import { useEndTicle } from '@/hooks/api/live';
import { useTicle } from '@/hooks/api/ticle';
import useMediasoup from '@/hooks/mediasoup/useMediasoup';
import useAuthStore from '@/stores/useAuthStore';
import { renderError } from '@/utils/toast/renderMessage';

function MediaContainer() {
  useMediasoup();

  const { ticleId } = useParams({ from: '/_authenticated/live/$ticleId' });
  const navigate = useNavigate({ from: '/live/$ticleId' });
  const userId = useAuthStore.getState().authInfo?.userId;

  const { data: ticleData, error } = useTicle(ticleId, userId || '');
  const { mutate: endTicleMutate } = useEndTicle();

  useEffect(() => {
    if (ticleData?.ticleStatus === 'closed') {
      toast(renderError('종료된 티클입니다.'));
      navigate({ to: '/' });
    }
  }, [ticleData?.ticleStatus, navigate, error]);

  const isOwner = ticleData?.isOwner || false;
  const handleTicleEnd = () => {
    endTicleMutate(ticleId);
  };

  return (
    <div className="flex h-dvh flex-col justify-between gap-y-4 bg-black">
      <StreamView />
      <footer className="flex w-full items-center justify-between gap-4 px-8 pb-4 text-white">
        <span className="text-body1 text-white">{ticleData?.title}</span>
        <ControlBar isOwner={isOwner} onTicleEnd={handleTicleEnd} />
      </footer>
    </div>
  );
}

export default MediaContainer;
