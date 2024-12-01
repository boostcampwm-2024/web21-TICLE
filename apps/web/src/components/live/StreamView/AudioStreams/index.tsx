import AudioPlayer from '@/components/live/StreamView/AudioStreams/AudioPlayer';
import { useRemoteStreamState } from '@/contexts/remoteStream/context';

function AudioStreams() {
  const { audioStreams } = useRemoteStreamState();

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
