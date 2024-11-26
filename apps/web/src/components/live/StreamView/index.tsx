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
const ITEMS_PER_SUB_GRID = 6;

const getColumnCount = (count: number) => {
  if (count <= 2) return count;
  if (count <= 6) return Math.ceil(count / 2);
  return Math.ceil(count / 3);
};

export interface StreamData {
  consumer?: types.Consumer;
  socketId: string;
  kind: types.MediaKind;
  stream: MediaStream | null;
  paused: boolean;
}

const StreamView = () => {
  const { video, audio } = useLocalStreamState();

  const { videoStreams, audioStreams } = useRemoteStreamState();
  const [pinnedConsumerId, setPinnedConsumerId] = useState<string | null>(null);
  const [pinnedVideoStreamData, setPinnedVideoStreamData] = useState<StreamData | null>(null);
  const allAudioStreamData: StreamData[] = [
    {
      consumer: undefined,
      socketId: 'local',
      kind: 'audio',
      stream: audio.stream,
      paused: audio.paused,
    },
    ...audioStreams,
  ];
  const allVideoStreamData: StreamData[] = [
    {
      consumer: undefined,
      socketId: 'local',
      kind: 'video',
      stream: video.stream,
      paused: video.paused,
    },
    ...videoStreams,
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
  const isFixedGrid = allVideoStreamData.length >= 9;
  const columnCount = getColumnCount(paginatedStreams.length);

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
    const pinnedStream = videoStreams.find((stream) => stream.consumer.id === pinnedConsumerId);

    if (pinnedStream) return;

    setPinnedVideoStreamData(null);
    setPinnedConsumerId(null);
  }, [videoStreams, pinnedConsumerId]);

  return (
    <div className="relative mt-5 flex h-full min-h-0 flex-1 items-center justify-center gap-5 rounded-lg">
      {pinnedConsumerId && pinnedVideoStreamData ? (
        <div className="relative flex h-full w-full flex-col gap-5">
          <div className="flex h-[80%] w-full justify-center self-center">
            <div className="aspect-video" onClick={removePinnedVideo}>
              <VideoPlayer
                stream={pinnedVideoStreamData.stream}
                muted={pinnedVideoStreamData.paused}
                isMicOn={getAudioMutedState(pinnedConsumerId)}
              />
            </div>
          </div>
          <div className="relative">
            <SubVideoGrid
              videoStreamData={subPaginatedStreams}
              onVideoClick={addPinnedVideo}
              pinnedConsumerId={pinnedConsumerId}
              getAudioMutedState={getAudioMutedState}
            />
            <PaginationControls {...subPaginationControlsProps} className="mt-8" />
          </div>
        </div>
      ) : (
        <>
          <VideoGrid
            videoStreamData={paginatedStreams}
            isFixedGrid={isFixedGrid}
            columnCount={columnCount}
            onVideoClick={addPinnedVideo}
            getAudioMutedState={getAudioMutedState}
          />
          <PaginationControls {...paginationControlsProps} className="h-full" />
        </>
      )}

      {audioStreams.map((streamData) => (
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
