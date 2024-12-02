import { useEffect } from 'react';
import { client } from '@repo/mediasoup';

import AudioPlayer from '@/components/live/StreamView/AudioStreams/AudioPlayer';
import { useRemoteStreamState } from '@/contexts/remoteStream/context';

interface AudioStreamProps {
  createAudioLevel: (stream: client.RemoteStream) => void;
}

function AudioStreams({ createAudioLevel }: AudioStreamProps) {
  const { audioStreams } = useRemoteStreamState();

  useEffect(() => {
    audioStreams.forEach((stream) => {
      if (stream.paused) return;
      createAudioLevel(stream);
    });
  }, [audioStreams]);

  return (
    <>
      {audioStreams.map((streamData) => (
        <AudioPlayer
          key={streamData.socketId}
          stream={streamData.stream}
          paused={streamData.paused}
        />
      ))}
    </>
  );
}

export default AudioStreams;
