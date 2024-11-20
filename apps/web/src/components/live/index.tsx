import { useState } from 'react';

import useMediasoup from '@/hooks/mediasoup/useMediasoup';

import AudioPlayer from './AudioPlayer';
import VideoPlayer from './VideoPlayer';

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

  const toggleScreenShare = () => {
    if (isScreenSharing && screenStream) {
      closeStream(screenStream, screenProducerRef);
    } else {
      startScreenStream();
    }
    setIsScreenSharing(!isScreenSharing);
  };

  const videoStreams = remoteStreams.filter((stream) => stream.kind === 'video');
  const columnCount = getColumnCount(videoStreams.length + 1);
  const videoWidth = `calc((100% - ${(columnCount - 1) * 20}px) / ${columnCount})`;

  return (
    <div className="fixed inset-0 flex flex-col justify-between bg-black px-32">
      <div className="flex h-full min-h-0 flex-1 items-center justify-center gap-5 rounded-lg">
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-wrap content-center justify-center gap-5">
            <div className="aspect-video" style={{ width: videoWidth }}>
              <VideoPlayer stream={videoStream} />
            </div>
            {remoteStreams.map((remoteStream) => (
              <div
                key={remoteStream.socketId}
                className={`aspect-video ${remoteStream.kind === 'audio' ? 'hidden' : ''}`}
                style={{ width: videoWidth }}
              >
                {remoteStream.kind === 'video' ? (
                  <VideoPlayer stream={remoteStream.stream} />
                ) : (
                  <AudioPlayer stream={remoteStream.stream} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="flex h-[70px] justify-center gap-4 bg-primary pb-4 text-white">
        footer 자리
      </footer>
    </div>
  );
}

export default MediaContainer;
