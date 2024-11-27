import { StreamData } from '@/components/live/StreamView';
import { useLocalStreamState } from '@/contexts/localStream/context';
import { useRemoteStreamState } from '@/contexts/remoteStream/context';

function useAudioState() {
  const { audio, screen } = useLocalStreamState();
  const { audioStreams } = useRemoteStreamState();

  const getAudioMutedState = (targetStream: StreamData) => {
    if (targetStream.stream?.id === screen.stream?.id) {
      return false;
    }

    if (targetStream.socketId === 'local') {
      return !audio.paused;
    }

    const targetAudioStream = audioStreams.find(
      (streamData) => streamData.socketId === targetStream.socketId
    );

    const isPaused = targetAudioStream?.paused;

    if (isPaused === undefined) return false;

    return !isPaused;
  };

  return { getAudioMutedState };
}

export default useAudioState;
