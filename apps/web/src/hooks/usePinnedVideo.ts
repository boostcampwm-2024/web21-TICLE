import { useEffect, useState } from 'react';
import { client } from '@repo/mediasoup';

import { useLocalStreamState } from '@/contexts/localStream/context';
import { useRemoteStreamState } from '@/contexts/remoteStream/context';

const usePinnedVideo = () => {
  const { video, screen, audio } = useLocalStreamState();
  const { videoStreams } = useRemoteStreamState();

  const [pinnedVideoStreamData, setPinnedVideoStreamData] = useState<client.RemoteStream | null>(
    null
  );

  const selectPinnedVideo = (stream: client.RemoteStream) => {
    setPinnedVideoStreamData(stream);
  };

  const removePinnedVideo = () => {
    setPinnedVideoStreamData(null);
  };

  // 선택된 비디오 스트림이 존재하지 않거나 로컬 스트림에 포함되어 있지 않을 경우
  useEffect(() => {
    const checkLocalStream = [video.stream, screen.stream].some(
      (stream) => stream?.id === pinnedVideoStreamData?.stream?.id
    );

    const pinnedStream = videoStreams.some(
      (streamData) => streamData.stream?.id === pinnedVideoStreamData?.stream?.id
    );

    if (!pinnedVideoStreamData || pinnedStream || checkLocalStream) {
      return;
    }

    setPinnedVideoStreamData(null);
  }, [videoStreams, video.stream, screen.stream]);

  // 원격 비디오 스트림이 업데이트 되었을 경우
  useEffect(() => {
    const pinnedStream = videoStreams.find(
      (streamData) => streamData.stream?.id === pinnedVideoStreamData?.stream?.id
    );

    if (!pinnedStream || !pinnedVideoStreamData) {
      return;
    }

    setPinnedVideoStreamData({ ...pinnedStream });
  }, [videoStreams]);

  // 로컬 비디오 스트림이 업데이트 되었을 경우
  useEffect(() => {
    const pinnedStream = [video, screen].find(
      (stream) => stream.stream?.id === pinnedVideoStreamData?.stream?.id
    );

    if (!pinnedStream || !pinnedVideoStreamData) {
      return;
    }

    setPinnedVideoStreamData({
      consumer: undefined,
      socketId: 'local',
      kind: 'video',
      stream: pinnedStream.stream,
      paused: pinnedStream.paused,
      nickname: pinnedVideoStreamData.nickname,
    });
  }, [video, screen, audio]);

  return { pinnedVideoStreamData, selectPinnedVideo, removePinnedVideo };
};

export default usePinnedVideo;
