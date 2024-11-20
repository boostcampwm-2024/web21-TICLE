import { useState } from 'react';

import ChevronLeftIc from '@/assets/icons/chevron-left.svg?react';
import ChevronRightIc from '@/assets/icons/chevron-right.svg?react';
import useMediasoup from '@/hooks/mediasoup/useMediasoup';

import AudioPlayer from './AudioPlayer';
import VideoPlayer from './VideoPlayer';

const ITEMS_PER_PAGE = 9;
const VIDEO_GAP_SIZE = 20;

const getColumnCount = (count: number) => {
  if (count <= 2) return count;
  if (count <= 6) return Math.ceil(count / 2);
  return Math.ceil(count / 3);
};

function MediaContainer() {
  const {
    remoteStreams,
    videoStream,
    screenStream,
    screenProducerRef,
    startScreenStream,
    closeStream,
  } = useMediasoup();
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const toggleScreenShare = () => {
    if (isScreenSharing && screenStream) {
      closeStream(screenStream, screenProducerRef);
    } else {
      startScreenStream();
    }
    setIsScreenSharing(!isScreenSharing);
  };

  const videoStreams = remoteStreams.filter((stream) => stream.kind === 'video');
  const paginatedStreams = videoStreams.slice(
    currentPage * (ITEMS_PER_PAGE - 1),
    (currentPage + 1) * (ITEMS_PER_PAGE - 1)
  );
  const totalPages = Math.ceil((videoStreams.length + 1) / ITEMS_PER_PAGE);
  const columnCount = getColumnCount(paginatedStreams.length + 1);
  const videoWidth = `calc((100% - ${(columnCount - 1) * VIDEO_GAP_SIZE}px) / ${columnCount})`;

  return (
    <div className="fixed inset-0 flex flex-col justify-between bg-black px-32">
      <div className="flex h-full min-h-0 flex-1 items-center justify-center gap-5 rounded-lg">
        <div className="flex-1 overflow-hidden">
          <div
            className="flex flex-wrap content-center justify-center"
            style={{ gap: VIDEO_GAP_SIZE + 'px' }}
          >
            {currentPage === 0 && (
              <div className="aspect-video" style={{ width: videoWidth }}>
                <VideoPlayer stream={videoStream} />
              </div>
            )}

            {paginatedStreams.map((stream) => (
              <div
                key={stream.socketId}
                className={`aspect-video ${stream.kind === 'audio' ? 'hidden' : ''}`}
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
        </div>
      </div>
      <div className="fixed inset-0 flex w-full justify-between">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
          style={{
            opacity: currentPage === 0 ? 0 : '100%',
          }}
        >
          <ChevronLeftIc />
        </button>
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
          style={{
            opacity: currentPage === totalPages - 1 && totalPages !== 0 ? 0 : '100%',
          }}
        >
          <ChevronRightIc />
        </button>
      </div>

      <footer className="flex h-[70px] justify-center gap-4 bg-primary pb-4 text-white">
        footer 자리
      </footer>
    </div>
  );
}

export default MediaContainer;
