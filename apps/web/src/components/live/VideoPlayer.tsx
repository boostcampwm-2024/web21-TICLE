import { cva } from 'class-variance-authority';
import { useEffect, useRef, useState } from 'react';

import MicOffIc from '@/assets/icons/mic-off.svg?react';
import MicOnIc from '@/assets/icons/mic-on.svg?react';

import Avatar from '../common/Avatar';
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
  avatarSize?: 'sm' | 'md' | 'lg';
}

function VideoPlayer({
  stream,
  muted = true,
  isMicOn = false,
  avatarSize = 'md',
}: VideoPlayerProps) {
  const NAME = '김티클'; // TODO: 이름 받아오기
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    videoRef.current.srcObject = stream;
    setIsLoading(false);
  }, [stream]);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.muted = muted;

    console.log(muted);
  }, [muted]);

  const onLoadedData = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      {isLoading && !muted ? (
        <div className="flex h-full items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-altWeak p-1">
            {isMicOn ? <MicOnIc className="text-white" /> : <MicOffIc className="fill-white" />}
          </div>
          <div className="absolute bottom-3 left-3">
            <Badge>{NAME}</Badge>
          </div>
        </>
      )}

      {!muted ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          preload="metadata"
          muted
          className={videoVariants({ loading: isLoading })}
          onLoadedData={onLoadedData}
        >
          <track default kind="captions" srcLang="en" src="SUBTITLE_PATH" />
          <source src="content.mp4" type="video/mp4" />
          <source src="content.webm" type="video/webm" />
          Your browser does not support the video.
        </video>
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-altWeak transition-opacity duration-300">
          <Avatar size={avatarSize} />
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
