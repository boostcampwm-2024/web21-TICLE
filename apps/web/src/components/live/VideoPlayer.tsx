/* eslint-disable jsx-a11y/media-has-caption */
import { cva } from 'class-variance-authority';
import { useEffect, useRef, useState } from 'react';

import MicOffIc from '@/assets/icons/mic-off.svg?react';
import MicOnIc from '@/assets/icons/mic-on.svg?react';

import Badge from '../common/Badge';
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

export interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  isMicOn?: boolean;
}

function VideoPlayer({ stream, muted = true, isMicOn = false }: VideoPlayerProps) {
  const NAME = '김티클'; // TODO: 이름 받아오기
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
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <div className="bg-altWeak absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full p-1">
            {isMicOn ? <MicOnIc className="text-white" /> : <MicOffIc className="fill-white" />}
          </div>
          <div className="absolute bottom-3 left-3">
            <Badge>{NAME}</Badge>
          </div>
        </>
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
