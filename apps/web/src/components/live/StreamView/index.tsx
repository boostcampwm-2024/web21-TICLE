import { types } from 'mediasoup-client';
import { useEffect, useMemo, useState } from 'react';

import AudioPlayer from '@/components/live/StreamView/AudioPlayer';
import PaginationControls from '@/components/live/StreamView/PaginationControls';
import SubVideoGrid from '@/components/live/StreamView/SubVideoGrid';
import VideoGrid from '@/components/live/StreamView/VideoGrid';
import VideoPlayer from '@/components/live/StreamView/VideoPlayer';
import { useLocalStreamState } from '@/contexts/localStream/context';
import { useRemoteStreamState } from '@/contexts/remoteStream/context';
import usePagination from '@/hooks/usePagination';

const ITEMS_PER_GRID = 9;
const ITEMS_PER_SUB_GRID = 4;
export interface StreamData {
  consumer?: types.Consumer;
  socketId: string;
  kind: types.MediaKind;
  stream: MediaStream | null;
  paused: boolean;
}

const StreamView = () => {
  const { video, audio } = useLocalStreamState();

  const { streams } = useRemoteStreamState();

  const remoteStreams = useMemo(() => streams, [streams]);

  const [pinnedConsumerId, setPinnedConsumerId] = useState<string | null>(null);
  const [pinnedVideoStreamData, setPinnedVideoStreamData] = useState<StreamData | null>(null);

  const remoteAudioStreamData = remoteStreams.filter((stream) => stream.kind === 'audio');
  const remoteVideoStreamData = remoteStreams.filter((stream) => stream.kind === 'video');

  const allAudioStreamData: StreamData[] = [
    {
      consumer: undefined,
      socketId: 'local',
      kind: 'audio',
      stream: audio.stream,
      paused: audio.paused,
    },
    ...remoteAudioStreamData,
  ];
  const allVideoStreamData: StreamData[] = [
    {
      consumer: undefined,
      socketId: 'local',
      kind: 'video',
      stream: video.stream,
      paused: video.paused,
    },
    ...remoteVideoStreamData,
  ];
  const { paginatedItems: paginatedStreams, ...paginationControlsProps } =
    usePagination<StreamData>({
      totalItems: allVideoStreamData,
      itemsPerPage: ITEMS_PER_GRID,
    });

  const { paginatedItems: subPaginatedStreams, ...subPaginationControlsProps } =
    usePagination<StreamData>({
      totalItems: allVideoStreamData,
      itemsPerPage: ITEMS_PER_SUB_GRID,
    });

  const addPinnedVideo = (consumerId?: string) => {
    if (!consumerId) return;

    setPinnedConsumerId(consumerId);

    const streamData = allVideoStreamData.find((streamData) => {
      return streamData.consumer?.id === consumerId;
    });

    if (!streamData) return;

    setPinnedVideoStreamData(streamData);
  };

  const removePinnedVideo = () => {
    setPinnedConsumerId(null);
    setPinnedVideoStreamData(null);
  };

  const getAudioMutedState = (socketId?: string): boolean => {
    const targetAudioStream = allAudioStreamData.find(
      (streamData) => streamData.socketId === socketId
    );
    const isPaused = targetAudioStream?.paused;

    if (isPaused === undefined) return false;
    return !isPaused;
  };

  useEffect(() => {
    const pinnedStream = remoteStreams.find((stream) => stream.consumer.id === pinnedConsumerId);
    if (pinnedStream) return;

    setPinnedVideoStreamData(null);
    setPinnedConsumerId(null);
  }, [remoteStreams, pinnedConsumerId]);

  return (
    <div className="relative flex h-full flex-1 items-center justify-center gap-5 px-12 pt-8">
      {pinnedConsumerId && pinnedVideoStreamData ? (
        <div className="relative flex h-full w-full flex-col gap-5">
          <div className="flex h-[80%] w-full justify-center self-center">
            <div className="w-full" onClick={removePinnedVideo}>
              <VideoPlayer
                stream={pinnedVideoStreamData.stream}
                muted={pinnedVideoStreamData.paused}
                isMicOn={getAudioMutedState(pinnedConsumerId)}
              />
            </div>
          </div>
          <div className="relative flex flex-1">
            <PaginationControls
              {...subPaginationControlsProps}
              leftClassName="left-2"
              rightClassName="right-2"
            >
              <SubVideoGrid
                videoStreamData={subPaginatedStreams}
                pinnedConsumerId={pinnedConsumerId}
                onVideoClick={addPinnedVideo}
                getAudioMutedState={getAudioMutedState}
              />
            </PaginationControls>
          </div>
        </div>
      ) : (
        <PaginationControls
          {...paginationControlsProps}
          leftClassName="left-2"
          rightClassName="right-2"
        >
          <VideoGrid
            videoStreamData={paginatedStreams}
            onVideoClick={addPinnedVideo}
            getAudioMutedState={getAudioMutedState}
          />
        </PaginationControls>
      )}

      {remoteAudioStreamData.map((streamData) => (
        <AudioPlayer
          key={streamData.socketId}
          stream={streamData.stream}
          muted={streamData.paused}
        />
      ))}
    </div>
  );
};

export default StreamView;
