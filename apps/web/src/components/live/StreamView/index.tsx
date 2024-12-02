import { types } from 'mediasoup-client';
import { MediaTypes } from '@repo/mediasoup';

import PinnedGrid from '@/components/live/StreamView/List/Pinned';
import UnPinnedGrid from '@/components/live/StreamView/List/UnPinned';
import useAudioState from '@/hooks/useAudioState';
import usePinnedVideo from '@/hooks/usePinnedVideo';

export interface StreamData {
  socketId: string;
  nickname: string;
  consumer?: types.Consumer<{ mediaTypes: MediaTypes; nickname: string }>;
  kind?: types.MediaKind;
  stream?: MediaStream | null;
  paused?: boolean;
}

const StreamView = () => {
  const { pinnedVideoStreamData, removePinnedVideo, selectPinnedVideo } = usePinnedVideo();
  const { getAudioMutedState } = useAudioState();

  return (
    <div className="relative flex h-full flex-1 items-center justify-center pt-8">
      {pinnedVideoStreamData ? (
        <PinnedGrid
          pinnedVideoStreamData={pinnedVideoStreamData}
          addPinnedVideo={selectPinnedVideo}
          removePinnedVideo={removePinnedVideo}
          getAudioMutedState={getAudioMutedState}
        />
      ) : (
        <UnPinnedGrid addPinnedVideo={selectPinnedVideo} getAudioMutedState={getAudioMutedState} />
      )}
    </div>
  );
};

export default StreamView;
