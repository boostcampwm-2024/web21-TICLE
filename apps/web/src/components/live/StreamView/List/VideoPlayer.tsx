import { cva } from 'class-variance-authority';
import { memo, useEffect, useRef, useState } from 'react';

import MicOffIc from '@/assets/icons/mic-off.svg?react';
import MicOnIc from '@/assets/icons/mic-on.svg?react';
import PinIc from '@/assets/icons/pin.svg?react';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import Loading from '@/components/common/Loading';
import cn from '@/utils/cn';

const videoVariants = cva(
  'absolute h-full w-full rounded-lg object-cover transition-opacity duration-300',
  {
    variants: {
      loading: {
        true: 'opacity-0',
        false: 'opacity-100',
      },
      isSpeaking: {
        true: 'border-4 border-primary',
        false: 'border-4 border-alt',
      },
    },
    defaultVariants: {
      loading: true,
      isSpeaking: false,
    },
  }
);

export interface VideoPlayerProps {
  stream: MediaStream | null;
  paused?: boolean;
  isMicOn?: boolean;
  avatarSize?: 'sm' | 'md' | 'lg';
  mediaType?: string;
  nickname: string;
  socketId?: string;
  isPinned?: boolean;
  activeSocketId: string | null;
}

function VideoPlayer({
  stream,
  paused = true,
  mediaType = 'video',
  isMicOn = false,
  avatarSize = 'md',
  nickname,
  socketId,
  isPinned = false,
  activeSocketId,
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isSpeaking = activeSocketId === socketId;

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;
    setIsLoading(false);
  }, [stream, paused]);

  const onLoadedData = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden bg-darkAlt">
      {stream &&
        (!paused ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            preload="metadata"
            className={videoVariants({
              loading: isLoading,
              isSpeaking,
            })}
            onLoadedData={onLoadedData}
          >
            <track default kind="captions" srcLang="en" src="SUBTITLE_PATH" />
            <source src="content.mp4" type="video/mp4" />
            <source src="content.webm" type="video/webm" />
            Your browser does not support the video.
          </video>
        ) : (
          <div className={videoVariants({ loading: false, isSpeaking })}>
            <Avatar
              size={avatarSize}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
            />
          </div>
        ))}
      {!stream && (
        <div
          className={cn(
            'flex h-full items-center justify-center',
            videoVariants({ loading: false })
          )}
        >
          <Loading />
        </div>
      )}
      <div className="absolute bottom-3 left-3">
        <Badge>{nickname}</Badge>
      </div>
      {stream && (
        <>
          {mediaType === 'video' && (
            <>
              <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-altWeak p-1">
                {isMicOn ? <MicOnIc className="text-white" /> : <MicOffIc className="fill-white" />}
              </div>

              {isPinned && (
                <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary p-1">
                  <PinIc className="fill-white" />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default memo(VideoPlayer);
