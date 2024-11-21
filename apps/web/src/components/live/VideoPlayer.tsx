import { useEffect, useRef } from 'react';

export interface MediaPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  className?: string;
}

function VideoPlayer({ stream, muted = true, className = '' }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || !stream) return;

    videoRef.current.srcObject = stream;
  }, [stream]);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.muted = muted;
  }, [muted]);

  return (
    <video ref={videoRef} autoPlay muted={muted} className={className}>
      <track default kind="captions" srcLang="en" src="SUBTITLE_PATH" />
      <source src="content.mp4" type="video/mp4" />
      <source src="content.webm" type="video/webm" />
      Your browser does not support the video.
    </video>
  );
}

export default VideoPlayer;
