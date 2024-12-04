import { cva } from 'class-variance-authority';
import { useEffect, useRef, useState } from 'react';

import { StreamData } from '@/components/live/StreamView';
import VideoPlayer from '@/components/live/StreamView/List/VideoPlayer';

const highlightVariants = cva(`h-full w-full overflow-hidden rounded-lg border-2`, {
  variants: {
    pinned: {
      true: 'border-primary',
      false: 'border-transparent',
    },
  },
  defaultVariants: {
    pinned: false,
  },
});

interface SubVideoGridProps {
  videoStreamData: StreamData[];
  pinnedVideoStreamData: StreamData | null;
  onVideoClick: (stream: StreamData) => void;
  getAudioMutedState: (stream: StreamData) => boolean;
}

function SubVideoGrid({
  videoStreamData,
  pinnedVideoStreamData,
  onVideoClick,
  getAudioMutedState,
}: SubVideoGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoMaxWidth, setVideoMaxWidth] = useState(0);
  useEffect(() => {
    // TODO: throttle resize event
    const adjustSize = () => {
      if (!containerRef.current) return;

      const height = containerRef.current.offsetHeight;

      setVideoMaxWidth(height * (16 / 9));
    };

    adjustSize();

    window.addEventListener('resize', adjustSize);

    return () => window.removeEventListener('resize', adjustSize);
  }, []);

  return (
    <div ref={containerRef} className="flex h-full flex-1 justify-center gap-5 px-10">
      {videoStreamData.map((streamData, idx) => (
        <div
          key={`${streamData.socketId}${idx}`}
          style={{ maxWidth: videoMaxWidth }}
          className={highlightVariants({
            pinned: pinnedVideoStreamData?.stream?.id === streamData.stream?.id,
          })}
          onClick={() => streamData.stream && onVideoClick(streamData)}
        >
          <VideoPlayer
            avatarSize="sm"
            paused={streamData.paused}
            nickname={streamData.nickname}
            stream={streamData.stream ?? null}
            isMicOn={streamData && getAudioMutedState(streamData)}
            mediaType={streamData.consumer?.appData?.mediaTypes ?? streamData.mediaType}
          />
        </div>
      ))}
    </div>
  );
}
export default SubVideoGrid;
