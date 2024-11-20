/* eslint-disable jsx-a11y/media-has-caption */
import { cva } from 'class-variance-authority';
import { useEffect, useRef, useState } from 'react';

import Loading from '../common/Loading/Loading';

const videoVariants = cva('h-full w-full rounded-lg object-cover transition-opacity duration-300', {
  variants: {
    loading: {
      true: 'opacity-0',
      false: 'opacity-100',
    },
  },
  defaultVariants: {
    loading: true,
  },
});

export interface MediaPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
}

function VideoPlayer({ stream, muted = true }: MediaPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      setIsLoading(true);
    }
  }, [stream]);

  const onLoadedData = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      {isLoading && (
        <div className="flex h-full items-center justify-center">
          <Loading />
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        preload="metadata"
        muted={muted}
        className={videoVariants({ loading: isLoading })}
        onLoadedData={onLoadedData}
      />
    </div>
  );
}

export default VideoPlayer;
