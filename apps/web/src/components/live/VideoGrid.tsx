/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { cva } from 'class-variance-authority';
import { useEffect } from 'react';

import VideoPlayer from './VideoPlayer';

import { StreamData } from '.';

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
}

function VideoGrid({ videoStreamData, isFixedGrid, columnCount, onVideoClick }: VideoGridProps) {
  const videoWidth = getVideoWidth(isFixedGrid, columnCount);

  return (
    <div className={containerVariants({ layout: isFixedGrid ? 'grid' : 'flex' })}>
      {videoStreamData.map((streamData) => (
        <div
          key={streamData.consumer?.id}
          className="aspect-video"
          style={{ width: videoWidth }}
          onClick={() => onVideoClick(streamData.consumer?.id)}
        >
          <VideoPlayer stream={streamData.stream} muted={streamData.pause} />
        </div>
      ))}
    </div>
  );
}

export default VideoGrid;
