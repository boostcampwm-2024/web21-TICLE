import { video } from 'framer-motion/client';
import { useState } from 'react';

import useMediasoup from '@/hooks/mediasoup/useMediasoup';

import AudioPlayer from './AudioPlayer';
import VideoPlayer from './VideoPlayer';

function MediaContainer() {
  const {
    remoteStreams,
    audioStream,
    videoStream,
    screenStream,
    screenProducerRef,
    startScreenStream,
    closeStream,
  } = useMediasoup();
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [cameraCount, setCameraCount] = useState(1);

  const toggleScreenShare = () => {
    if (isScreenSharing && screenStream) {
      closeStream(screenStream, screenProducerRef);
    } else {
      startScreenStream();
    }
    setIsScreenSharing((prev) => !prev);
  };

  const getRowCount = (count: number) => {
    if (count <= 2) return 1;
    if (count <= 6) return 2;
    return 3;
  };

  const getItemWidth = (totalItemCount: number) => {
    const rowCount = getRowCount(totalItemCount);
    const columnCount = Math.ceil(totalItemCount / rowCount);
    return `calc((100% - ${(columnCount - 1) * 20}px) / ${columnCount})`;
  };

  const videoWidth = getItemWidth(cameraCount);

  return (
    <div className="fixed inset-0 flex flex-col justify-between bg-black px-32">
      <div className="flex h-full min-h-0 flex-1 items-center justify-center gap-5 rounded-lg">
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-wrap content-center justify-center gap-5">
            {Array.from({ length: cameraCount }).map((_, index) => (
              <div
                className="aspect-video"
                key={index}
                style={{
                  width: videoWidth,
                }}
              >
                <VideoPlayer stream={videoStream} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setCameraCount((prev) => prev + 1)}
          className="rounded bg-primary px-4 py-2 text-white"
        >
          카메라 추가
        </button>
        <button
          onClick={() => setCameraCount((prev) => Math.max(1, prev - 1))}
          className="rounded bg-primary px-4 py-2 text-white"
        >
          카메라 삭제
        </button>
      </div>
    </div>
  );
}

export default MediaContainer;
