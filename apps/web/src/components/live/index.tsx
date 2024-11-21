import { types } from 'mediasoup-client';
import { useState } from 'react';
import { SOCKET_EVENTS } from '@repo/mediasoup';

import ControlBar from '@/components/live/ControlBar';
import useMediasoup from '@/hooks/mediasoup/useMediasoup';
import usePagination from '@/hooks/usePagination';

import AudioPlayer from './AudioPlayer';
import PaginationControls from './PaginationControls';
import SubVideoGrid from './SubVideoGrid';
import VideoGrid from './VideoGrid';
import VideoPlayer from './VideoPlayer';

const ITEMS_PER_GRID = 9;
const ITEMS_PER_SUB_GRID = 6;

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
    socketRef,

    remoteStreams,

    videoStream: localVideoStream,
    screenStream: localScreenStream,
    audioStream,

    audioProducerRef,
    videoProducerRef,

    screenProducerRef,
    startScreenStream,
    closeStream,

    pauseStream,
    resumeStream,

    disconnect,
  } = useMediasoup();

  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [pinnedSocketId, setPinnedSocketId] = useState<string | null>(null);
  const [pinnedVideoStreamData, setPinnedVideoSreamData] = useState<StreamData | null>(null);

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing && localScreenStream) {
        closeStream(localScreenStream, screenProducerRef);
      } else {
        await startScreenStream();
      }

      setIsScreenSharing((prev) => !prev);
    } catch (_) {
      setIsScreenSharing(false);
    }
  };

  const toggleVideo = () => {
    if (!localVideoStream) return;

    if (isVideoPaused) {
      resumeStream(localVideoStream, videoProducerRef);
    } else {
      pauseStream(localVideoStream, videoProducerRef);
    }
    setIsVideoPaused((prev) => !prev);
  };

  const toggleAudio = () => {
    if (!audioStream) return;

    if (isAudioMuted) {
      resumeStream(audioStream, audioProducerRef);
    } else {
      pauseStream(audioStream, audioProducerRef);
    }
    setIsAudioMuted((prev) => !prev);
  };

  const handleExit = (isOwner: boolean) => {
    if (isOwner) {
      socketRef.current?.emit(SOCKET_EVENTS.closeRoom);
    }

    disconnect();
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
      itemsPerPage: ITEMS_PER_GRID,
    });

  const { paginatedItems: subPaginatedStreams, ...subPaginationControlsProps } =
    usePagination<StreamData>({
      totalItems: allVideoStreamData,
      itemsPerPage: ITEMS_PER_SUB_GRID,
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
          <div className="relative flex h-full w-full flex-col gap-5">
            <div className="flex h-[80%] w-full justify-center self-center">
              <div className="aspect-video">
                <VideoPlayer stream={pinnedVideoStreamData.stream} />
              </div>
            </div>
            <div className="relative">
              <SubVideoGrid
                videoStreamData={subPaginatedStreams}
                onVideoClick={handleVideoPin}
                pinnedSocketId={pinnedSocketId}
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
              onVideoClick={handleVideoPin}
            />
            <PaginationControls {...paginationControlsProps} className="h-full" />
          </>
        )}

        {remoteAudioStreamData.map((streamData) => (
          <AudioPlayer
            key={streamData.socketId}
            stream={streamData.stream}
            muted={streamData.pause}
          />
        ))}
      </div>

      <footer className="flex h-[70px] w-full justify-end gap-4 pb-4 text-white">
        <ControlBar
          isVideoPaused={isVideoPaused}
          isAudioMuted={isAudioMuted}
          isScreenSharing={isScreenSharing}
          toggleVideo={toggleVideo}
          toggleAudio={toggleAudio}
          toggleScreenShare={toggleScreenShare}
          handleExit={handleExit}
        />
      </footer>
    </div>
  );
}

export default MediaContainer;
