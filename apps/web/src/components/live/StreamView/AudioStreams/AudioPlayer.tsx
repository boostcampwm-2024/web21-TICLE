/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef } from 'react';

import { VideoPlayerProps } from '@/components/live/StreamView/List/VideoPlayer';

function AudioPlayer({ stream, paused = false }: VideoPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
    }
  }, [stream]);

  return <audio ref={audioRef} autoPlay muted={paused} />;
}

export default AudioPlayer;
