import { useEffect, useState } from 'react';

import useMediasoup from '@/hooks/mediasoup/useMediasoup';

import AudioPlayer from './AudioPlayer';
import VideoPlayer from './VideoPlayer';

function MediaContainer() {
  const { remoteStreams } = useMediasoup();

  // 로컬 스트림 상태 관리
  const [localVideoStream, setLocalVideoStream] = useState<MediaStream | null>(null);
  const [localAudioStream, setLocalAudioStream] = useState<MediaStream | null>(null);
  const [localScreenStream, setLocalScreenStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // 스트림 초기화 및 정리를 위한 cleanup 함수들
  const cleanupStreams = () => {
    if (localVideoStream) {
      localVideoStream.getTracks().forEach((track) => track.stop());
      setLocalVideoStream(null);
    }
    if (localAudioStream) {
      localAudioStream.getTracks().forEach((track) => track.stop());
      setLocalAudioStream(null);
    }
    if (localScreenStream) {
      localScreenStream.getTracks().forEach((track) => track.stop());
      setLocalScreenStream(null);
    }
  };

  // 비디오 스트림 초기화
  const initVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setLocalVideoStream(stream);
    } catch (error) {
      console.error('Failed to get video stream:', error);
      setLocalVideoStream(null);
    }
  };

  // 오디오 스트림 초기화
  const initAudioStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setLocalAudioStream(stream);
    } catch (error) {
      console.error('Failed to get audio stream:', error);
      setLocalAudioStream(null);
    }
  };

  // 화면 공유 스트림 초기화
  const initScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      // 화면 공유 종료 이벤트 처리
      stream.getVideoTracks()[0].onended = () => {
        if (localScreenStream) {
          localScreenStream.getTracks().forEach((track) => track.stop());
        }
        setLocalScreenStream(null);
        setIsScreenSharing(false);
      };

      setLocalScreenStream(stream);
      setIsScreenSharing(true);
    } catch (error) {
      console.error('Failed to start screen sharing:', error);
      setLocalScreenStream(null);
      setIsScreenSharing(false);
    }
  };

  // 컴포넌트 마운트시 스트림 초기화
  useEffect(() => {
    const initialize = async () => {
      await Promise.all([initVideoStream(), initAudioStream()]);
    };

    initialize();

    // 컴포넌트 언마운트시 cleanup
    return () => {
      cleanupStreams();
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Local Streams */}
      <div className="col-span-2 mb-4">
        <div className="relative aspect-video">
          {localVideoStream && (
            <VideoPlayer
              stream={localVideoStream}
              muted
              className="h-full w-full rounded-lg object-cover"
            />
          )}
          {localScreenStream && (
            <div className="absolute right-0 top-0 aspect-video w-1/4">
              <VideoPlayer
                stream={localScreenStream}
                muted
                className="h-full w-full rounded-lg border-2 border-blue-500 object-cover"
              />
            </div>
          )}
          {localAudioStream && <AudioPlayer stream={localAudioStream} muted className="hidden" />}
          <div className="bg-black/50 absolute bottom-2 left-2 rounded px-2 py-1 text-sm text-white">
            나 (Local)
          </div>
          {/* Media Controls */}
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button
              onClick={initScreenShare}
              className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
              disabled={isScreenSharing}
            >
              {isScreenSharing ? '화면 공유 중' : '화면 공유'}
            </button>
          </div>
        </div>
      </div>

      {/* Remote Streams */}
      {remoteStreams.map((remote, index) => (
        <div key={`${remote.socketId}-${index}`} className="relative aspect-video">
          {remote.kind === 'video' && (
            <VideoPlayer stream={remote.stream} className="h-full w-full rounded-lg object-cover" />
          )}
          {remote.kind === 'audio' && <AudioPlayer stream={remote.stream} className="hidden" />}
          <div className="bg-black/50 absolute bottom-2 left-2 rounded px-2 py-1 text-sm text-white">
            {remote.socketId}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MediaContainer;
