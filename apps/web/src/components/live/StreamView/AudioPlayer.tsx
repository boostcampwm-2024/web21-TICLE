import { useEffect, useRef } from 'react';

import { VideoPlayerProps } from './VideoPlayer';

function AudioPlayer({ stream, muted = false }: VideoPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
    }
  }, [stream]);

  return <audio ref={audioRef} autoPlay muted={muted} />;
}

export default AudioPlayer;
