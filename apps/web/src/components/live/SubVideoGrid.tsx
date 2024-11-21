/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import VideoPlayer from './VideoPlayer';

import { StreamData } from '.';

interface SubVideoGridProps {
  videoStreamData: StreamData[];
  onVideoClick: (consumerId?: string) => void;
  pinnedConsumerId?: string;
}

function SubVideoGrid({ videoStreamData, onVideoClick, pinnedConsumerId }: SubVideoGridProps) {
  return (
    <div className="absolute flex w-full justify-center gap-5">
      {videoStreamData.map(
        (streamData) =>
          streamData.consumer?.id !== pinnedConsumerId && (
            <div
              key={streamData.consumer?.id}
              className="aspect-video w-44"
              onClick={() => onVideoClick(streamData.consumer?.id)}
            >
              <VideoPlayer stream={streamData.stream} avatarSize="sm" muted={streamData.pause} />
            </div>
          )
      )}
    </div>
  );
}

export default SubVideoGrid;
