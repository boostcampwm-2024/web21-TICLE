/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef } from 'react';

import { MediaPlayerProps } from './VideoPlayer';

function AudioPlayer({ stream, muted = false, className = '' }: MediaPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
    }
  }, [stream]);

  return <audio ref={audioRef} autoPlay muted={muted} className={className} />;
}

export default AudioPlayer;