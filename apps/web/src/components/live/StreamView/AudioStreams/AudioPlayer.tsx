import { useEffect, useRef } from 'react';

import { VideoPlayerProps } from '@/components/live/StreamView/List/VideoPlayer';

type AudioPlayerProps = Omit<VideoPlayerProps, 'nickname'>;

function AudioPlayer({ stream, paused = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
    }
  }, [stream]);

  return <audio ref={audioRef} autoPlay muted={paused} />;
}

export default AudioPlayer;
