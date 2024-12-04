import { useEffect, useState } from 'react';
import { MediaTypes } from '@repo/mediasoup';

import { LocalStream, MediaDevice } from '@/contexts/localStream/context';
import { toast } from '@/core/toast';
import { getCameraStream, getMicStream, getScreenStream } from '@/utils/stream';

const DEFAULT_LOCAL_STREAM = {
  stream: null,
  paused: true,
} as const;

const getMediaDevices = (kind: MediaDeviceKind, devices: MediaDeviceInfo[]) => {
  return devices
    .filter((device) => device.kind === kind && device.deviceId && device.deviceId !== 'default')
    .map((device) => ({ label: device.label, value: device.deviceId }));
};

const useMediaTracks = () => {
  const [video, setVideo] = useState<LocalStream>({ ...DEFAULT_LOCAL_STREAM });
  const [audio, setAudio] = useState<LocalStream>({ ...DEFAULT_LOCAL_STREAM });
  const [screen, setScreen] = useState<LocalStream>({ ...DEFAULT_LOCAL_STREAM });

  const [videoDevices, setVideoDevices] = useState<MediaDevice[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDevice[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDevice[]>([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string | null>(null);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string | null>(null);
  const [selectedAudioOutputDeviceId, setSelectedAudioOutputDeviceId] = useState<string | null>(
    null
  );

  const getCameraTrack = async () => {
    const options = selectedVideoDeviceId ? { deviceId: selectedVideoDeviceId } : {};

    const stream = await getCameraStream(options);
    const track = stream.getVideoTracks()[0];
    if (!track) return;

    setVideo({ stream, paused: true });

    return track;
  };

  const getAudioTrack = async () => {
    const options = selectedAudioDeviceId ? { deviceId: selectedAudioDeviceId } : {};

    const stream = await getMicStream(options);

    const track = stream.getAudioTracks()[0];

    if (!track) return;

    setAudio({ stream, paused: true });

    return track;
  };

  const getScreenTrack = async () => {
    if (screen.stream) {
      return;
    }

    const stream = await getScreenStream();

    const track = stream.getVideoTracks()[0];

    if (!track) return;

    setScreen({ stream, paused: false });

    return track;
  };

  const clearStreams = () => {
    setVideo((prev) => {
      prev.stream?.getTracks().forEach((track) => track.stop());
      return { ...DEFAULT_LOCAL_STREAM };
    });
    setAudio((prev) => {
      prev.stream?.getTracks().forEach((track) => track.stop());
      return { ...DEFAULT_LOCAL_STREAM };
    });
    setScreen((prev) => {
      prev.stream?.getTracks().forEach((track) => track.stop());
      return { ...DEFAULT_LOCAL_STREAM };
    });
  };

  const getMediaState = (type: MediaTypes) => {
    if (type === 'video') {
      return [video, setVideo] as const;
    }

    if (type === 'audio') {
      return [audio, setAudio] as const;
    }

    if (type === 'screen') {
      return [screen, setScreen] as const;
    }

    throw new Error('Invalid stream type');
  };

  useEffect(() => {
    const fetchMediaDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();

        const videoInputs = getMediaDevices('videoinput', devices);
        const audioInputs = getMediaDevices('audioinput', devices);
        const audioOutputs = getMediaDevices('audiooutput', devices);

        setVideoDevices(videoInputs);
        setAudioDevices(audioInputs);
        setAudioOutputDevices(audioOutputs);

        if (videoInputs[0]) setSelectedVideoDeviceId(videoInputs[0].value);
        if (audioInputs[0]) setSelectedAudioDeviceId(audioInputs[0].value);
        if (audioOutputs[0]) setSelectedAudioOutputDeviceId(audioOutputs[0].value);
      } catch (_) {
        toast('미디어 정보를 가져올 수 없습니다.');
      }
    };

    fetchMediaDevices();
  }, []);

  return {
    video,
    audio,
    screen,
    getCameraTrack,
    getAudioTrack,
    getScreenTrack,

    videoDevices,
    audioDevices,
    audioOutputDevices,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    selectedAudioOutputDeviceId,
    setSelectedVideoDeviceId,
    setSelectedAudioDeviceId,
    setSelectedAudioOutputDeviceId,

    getMediaState,
    clearStreams,
  };
};

export default useMediaTracks;
