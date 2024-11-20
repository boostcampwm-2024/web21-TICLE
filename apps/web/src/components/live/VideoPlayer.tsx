import { useEffect, useRef } from 'react';

export interface MediaPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
}

function VideoPlayer({ stream, muted = true }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted={muted}
      className="h-full w-full rounded-lg object-cover"
      preload="metadata"
    />
  );
}
export default VideoPlayer;
