import { useEffect, useRef, useState } from 'react';

import { useLocalStreamAction, useLocalStreamState } from '@/contexts/localStream/context';
import { getCameraStream } from '@/utils/stream';

function SelectMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const { videoDevices, audioDevices, selectedVideoDeviceId, selectedAudioDeviceId } =
    useLocalStreamState();

  const { setSelectedVideoDeviceId, setSelectedAudioDeviceId } = useLocalStreamAction();

  useEffect(() => {
    const getStream = async () => {
      if (!selectedVideoDeviceId || !videoRef.current) return;

      stream?.getTracks().forEach((track) => track.stop());

      const cameraStream = await getCameraStream({ video: { deviceId: selectedVideoDeviceId } });

      videoRef.current.srcObject = cameraStream;

      setStream(cameraStream);
    };

    getStream();
  }, [selectedVideoDeviceId]);

  return (
    <div className="flex h-full flex-col gap-y-4 overflow-y-auto">
      <div>
        <h2 className="text-h4 text-alt">카메라</h2>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="aspect-video w-full rounded-lg bg-alt"
        />
        {videoDevices.length === 0 && (
          <p className="mt-2 text-body2 text-alt">사용 가능한 카메라가 없습니다.</p>
        )}
        {videoDevices.length !== 0 && (
          <select
            value={selectedVideoDeviceId ?? '선택'}
            onChange={(e) => setSelectedVideoDeviceId(e.target.value)}
            className="mt-2 w-full"
          >
            {videoDevices.map((device) => (
              <option key={device.value} value={device.value}>
                {device.label}
              </option>
            ))}
          </select>
        )}
      </div>
      <div>
        <h2 className="text-h4 text-alt">마이크</h2>
        {audioDevices.length === 0 && (
          <p className="mt-2 text-body2 text-alt">사용 가능한 마이크가 없습니다.</p>
        )}
        {audioDevices.length !== 0 && (
          <select
            disabled={audioDevices.length === 0}
            value={selectedAudioDeviceId ?? '선택'}
            className="mt-2 w-full"
            onChange={(e) => setSelectedAudioDeviceId(e.target.value)}
          >
            {audioDevices.map((device) => (
              <option key={device.value} value={device.value}>
                {device.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

export default SelectMedia;
