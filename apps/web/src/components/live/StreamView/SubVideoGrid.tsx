import { StreamData } from '@/components/live';
import VideoPlayer from '@/components/live/StreamView/VideoPlayer';

interface SubVideoGridProps {
  videoStreamData: StreamData[];
  onVideoClick: (consumerId?: string) => void;
  pinnedConsumerId?: string;
  getAudioMutedState: (socketId?: string) => boolean;
}

function SubVideoGrid({
  videoStreamData,
  pinnedConsumerId,
  onVideoClick,
  getAudioMutedState,
}: SubVideoGridProps) {
  return (
    <div className="flex h-full w-full justify-center gap-5 px-10">
      {videoStreamData.map(
        (streamData) =>
          streamData.consumer?.id !== pinnedConsumerId && (
            <div
              key={streamData.consumer?.id}
              className="aspect-video h-full"
              onClick={() => onVideoClick(streamData.consumer?.id)}
            >
              <VideoPlayer
                stream={streamData.stream}
                avatarSize="sm"
                muted={streamData.paused}
                isMicOn={getAudioMutedState(streamData.socketId)}
              />
            </div>
          )
      )}
    </div>
  );
}

export default SubVideoGrid;
