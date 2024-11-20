import { types } from 'mediasoup-client';
import { useState } from 'react';

import useMediasoup from '@/hooks/mediasoup/useMediasoup';
import usePagination from '@/hooks/usePagination';

import AudioPlayer from './AudioPlayer';
import PaginationControls from './PaginationControls';
import SubVideoGrid from './SubVideoGrid';
import VideoGrid from './VideoGrid';
import VideoPlayer from './VideoPlayer';

const ITEMS_PER_PAGE = 9;

export interface StreamData {
  consumer?: types.Consumer;
  socketId: string;
  kind: types.MediaKind;
  stream: MediaStream | null;
  pause: boolean;
}

const getColumnCount = (count: number) => {
  if (count <= 2) return count;
  if (count <= 6) return Math.ceil(count / 2);
  return Math.ceil(count / 3);
};

function MediaContainer() {
  const {
    remoteStreams,
    videoStream: localVideoStream,
    screenStream: localScreenStream,
    screenProducerRef,
    startScreenStream,
    closeStream,
  } = useMediasoup();
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [pinnedSocketId, setPinnedSocketId] = useState<string | null>(null);
  const [pinnedVideoStreamData, setPinnedVideoSreamData] = useState<StreamData | null>(null);

  const toggleScreenShare = () => {
    if (isScreenSharing && localScreenStream) {
      closeStream(localScreenStream, screenProducerRef);
    } else {
      startScreenStream();
    }
    setIsScreenSharing(!isScreenSharing);
  };

  const remoteAudioStreamData = remoteStreams.filter((stream) => stream.kind === 'audio');
  const remoteVideoStreamData = remoteStreams.filter((stream) => stream.kind === 'video');
  const allVideoStreamData: StreamData[] = [
    {
      consumer: undefined,
      socketId: 'local',
      kind: 'video',
      stream: localVideoStream,
      pause: false,
    },
    ...remoteVideoStreamData,
  ];

  const { paginatedItems: paginatedStreams, ...paginationControlsProps } =
    usePagination<StreamData>({
      totalItems: allVideoStreamData,
      itemsPerPage: ITEMS_PER_PAGE,
    });

  const isFixedGrid = allVideoStreamData.length >= 9;
  const columnCount = getColumnCount(paginatedStreams.length);

  const handleVideoPin = (socketId: string) => {
    setPinnedSocketId(socketId);
    const streamData = allVideoStreamData.find((streamData) => streamData.socketId === socketId);
    if (!streamData) return;

    setPinnedVideoSreamData(streamData);
  };

  return (
    <div className="fixed inset-0 flex flex-col justify-between bg-black px-32">
      <div className="relative mt-5 flex h-full min-h-0 flex-1 items-center justify-center gap-5 rounded-lg">
        {pinnedSocketId && pinnedVideoStreamData ? (
          <div className="flex h-full w-full flex-col gap-5">
            <VideoPlayer stream={pinnedVideoStreamData.stream} />
            <SubVideoGrid
              videoStreamData={paginatedStreams}
              onVideoClick={handleVideoPin}
              pinnedSocketId={pinnedSocketId}
            />
          </div>
        ) : (
          <>
            <VideoGrid
              videoStreamData={paginatedStreams}
              isFixedGrid={isFixedGrid}
              columnCount={columnCount}
              onVideoClick={handleVideoPin}
            />
            <PaginationControls {...paginationControlsProps} />
          </>
        )}

        {remoteAudioStreamData.map((streamData) => (
          <AudioPlayer key={streamData.socketId} stream={streamData.stream} />
        ))}
      </div>

      <footer className="flex h-[70px] justify-center gap-4 bg-primary pb-4 text-white">
        footer 자리
      </footer>
    </div>
  );
}

export default MediaContainer;
