import { useEffect, useRef } from 'react';

import { MediaPlayerProps } from './VideoPlayer';

function AudioPlayer({ stream, muted = false, className = '' }: MediaPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
    }
  }, [stream]);

  return <audio ref={audioRef} autoPlay playsInline muted={muted} className={className} />;
}

export default AudioPlayer;
