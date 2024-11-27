import { types } from 'mediasoup-client';

import AudioStreams from '@/components/live/StreamView/AudioStreams';
import PinnedList from '@/components/live/StreamView/List/Pinned';
import UnPinnedList from '@/components/live/StreamView/List/UnPinned';
import useAudioState from '@/hooks/useAudioState';
import usePinnedVideo from '@/hooks/usePinnedVideo';

export interface StreamData {
  consumer?: types.Consumer;
  socketId: string;
  kind: types.MediaKind;
  stream: MediaStream | null;
  paused: boolean;
}

const StreamView = () => {
  const { pinnedVideoStreamData, removePinnedVideo, selectPinnedVideo } = usePinnedVideo();
  const { getAudioMutedState } = useAudioState();

  return (
    <div className="relative flex h-full flex-1 items-center justify-center pt-8">
      {pinnedVideoStreamData ? (
        <PinnedList
          pinnedVideoStreamData={pinnedVideoStreamData}
          addPinnedVideo={selectPinnedVideo}
          removePinnedVideo={removePinnedVideo}
          getAudioMutedState={getAudioMutedState}
        />
      ) : (
        <UnPinnedList addPinnedVideo={selectPinnedVideo} getAudioMutedState={getAudioMutedState} />
      )}
      <AudioStreams />
    </div>
  );
};

export default StreamView;
