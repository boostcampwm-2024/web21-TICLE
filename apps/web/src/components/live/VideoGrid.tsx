import { cva } from 'class-variance-authority';

import VideoPlayer from './VideoPlayer';

import { StreamData } from '.';

interface VideoGridProps {
  videoStreamData: StreamData[];
  isFixedGrid: boolean;
  columnCount: number;
}

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

function VideoGrid({ videoStreamData, isFixedGrid, columnCount }: VideoGridProps) {
  const videoWidth = getVideoWidth(isFixedGrid, columnCount);
  return (
    <div className={containerVariants({ layout: isFixedGrid ? 'grid' : 'flex' })}>
      {videoStreamData.map((streamData) => (
        <div
          key={streamData.socketId}
          className="aspect-video flex-1"
          style={{ width: videoWidth }}
        >
          <VideoPlayer stream={streamData.stream} />
        </div>
      ))}
    </div>
  );
}

export default VideoGrid;
