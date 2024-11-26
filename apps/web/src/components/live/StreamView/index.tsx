import { types } from 'mediasoup-client';

import AudioStreams from '@/components/live/StreamView/AudioStreams';
import PinedList from '@/components/live/StreamView/List/Pined';
import UnPinedList from '@/components/live/StreamView/List/UnPined';
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
        <PinedList
          pinnedVideoStreamData={pinnedVideoStreamData}
          addPinnedVideo={selectPinnedVideo}
          removePinnedVideo={removePinnedVideo}
          getAudioMutedState={getAudioMutedState}
        />
      ) : (
        <UnPinedList addPinnedVideo={selectPinnedVideo} getAudioMutedState={getAudioMutedState} />
      )}
      <AudioStreams />
    </div>
  );
};

export default StreamView;
