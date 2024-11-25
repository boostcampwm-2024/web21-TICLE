import { cva } from 'class-variance-authority';

import { StreamData } from '@/components/live/StreamView';

import VideoPlayer from './VideoPlayer';

const containerVariants = cva('flex-1 gap-5 overflow-hidden', {
  variants: {
    layout: {
      grid: `grid grid-cols-3`,
      flex: 'flex flex-wrap content-center justify-center',
    },
  },
  defaultVariants: {
    layout: 'flex',
  },
});

const getVideoWidth = (isFixedGrid: boolean, columnCount: number) => {
  return isFixedGrid ? '100%' : `calc((100% - ${columnCount * 20}px) /${columnCount})`;
};

interface VideoGridProps {
  videoStreamData: StreamData[];
  isFixedGrid: boolean;
  columnCount: number;
  onVideoClick: (consumerId?: string) => void;
  getAudioMutedState: (socketId?: string) => boolean;
}

function VideoGrid({
  videoStreamData,
  isFixedGrid,
  columnCount,
  onVideoClick,
  getAudioMutedState,
}: VideoGridProps) {
  const videoWidth = getVideoWidth(isFixedGrid, columnCount);

  return (
    <div className={containerVariants({ layout: isFixedGrid ? 'grid' : 'flex' })}>
      {videoStreamData.map((streamData, idx) => (
        <div
          key={`${streamData.consumer?.id}${idx}`}
          className="aspect-video"
          style={{ width: videoWidth }}
          onClick={() => onVideoClick(streamData.consumer?.id)}
        >
          <VideoPlayer
            stream={streamData.stream}
            muted={streamData.paused}
            isMicOn={getAudioMutedState(streamData.socketId)}
          />
        </div>
      ))}
    </div>
  );
}

export default VideoGrid;
