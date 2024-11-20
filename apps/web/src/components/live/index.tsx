import { cva } from 'class-variance-authority';
import { useState } from 'react';

import ChevronLeftIc from '@/assets/icons/chevron-left.svg?react';
import ChevronRightIc from '@/assets/icons/chevron-right.svg?react';
import useMediasoup from '@/hooks/mediasoup/useMediasoup';

import AudioPlayer from './AudioPlayer';
import VideoPlayer from './VideoPlayer';

const ITEMS_PER_PAGE = 9;

const containerVariants = cva('flex-1 gap-5 overflow-hidden', {
  variants: {
    layout: {
      grid: `grid grid-cols-3`,
      flex: 'flex flex-wrap content-center justify-center',
    },
  },
  defaultVariants: {
    layout: 'flex',
  },
});

const videoVariants = cva('aspect-video', {
  variants: {
    type: {
      video: '',
      audio: 'hidden',
    },
  },
  defaultVariants: {
    type: 'video',
  },
});

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
  const [currentPage, setCurrentPage] = useState(0);

  const toggleScreenShare = () => {
    if (isScreenSharing && localScreenStream) {
      closeStream(localScreenStream, screenProducerRef);
    } else {
      startScreenStream();
    }
    setIsScreenSharing(!isScreenSharing);
  };

  const remoteVideoStreams = remoteStreams.filter((stream) => stream.kind === 'video');
  const allVideoStreams = [
    {
      consumer: null,
      socketId: null,
      kind: 'video',
      stream: localVideoStream,
      pause: false,
    },
    ...remoteVideoStreams,
  ];
  const paginatedStreams = allVideoStreams.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(allVideoStreams.length / ITEMS_PER_PAGE);

  const isFixedGrid = allVideoStreams.length >= 9;
  const columnCount = getColumnCount(paginatedStreams.length);
  const videoWidth = isFixedGrid ? '100%' : `calc((100% - ${columnCount * 20}px) / ${columnCount})`;

  return (
    <div className="fixed inset-0 flex flex-col justify-between bg-black px-32">
      <div className="relative flex h-full min-h-0 flex-1 items-center justify-center gap-5 rounded-lg">
        <div className={containerVariants({ layout: isFixedGrid ? 'grid' : 'flex' })}>
          {paginatedStreams.map((stream) => (
            <div
              key={stream.socketId}
              className={videoVariants({ type: stream.kind as 'video' | 'audio' })}
              style={{ width: videoWidth }}
            >
              {stream.kind === 'video' ? (
                <VideoPlayer stream={stream.stream} />
              ) : (
                <AudioPlayer stream={stream.stream} />
              )}
            </div>
          ))}
        </div>
        {currentPage !== 0 && (
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            className="absolute left-[-45px] flex h-full items-center"
          >
            <ChevronLeftIc />
          </button>
        )}
        {currentPage !== totalPages - 1 && (
          <button
            type="button"
            className="absolute right-[-45px] flex h-full items-center"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
          >
            <ChevronRightIc />
          </button>
        )}
      </div>

      <footer className="flex h-[70px] justify-center gap-4 bg-primary pb-4 text-white">
        footer 자리
      </footer>
    </div>
  );
}

export default MediaContainer;
