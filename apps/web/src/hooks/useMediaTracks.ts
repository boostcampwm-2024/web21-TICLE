import { useEffect, useState } from 'react';
import { MediaTypes } from '@repo/mediasoup';

import { LocalStream, MediaDevice } from '@/contexts/localStream/context';
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
    if (!selectedVideoDeviceId) {
      return;
    }

    const stream = await getCameraStream({
      video: { deviceId: selectedVideoDeviceId },
    });
    const track = stream.getVideoTracks()[0];

    if (!track) {
      return;
    }

    setVideo({ stream, paused: true });

    return track;
  };

  const getAudioTrack = async () => {
    if (!selectedAudioDeviceId) {
      return;
    }

    const stream = await getMicStream({
      audio: {
        deviceId: {
          exact: selectedAudioDeviceId,
          ideal: selectedAudioDeviceId,
        },
      },
    });

    const track = stream.getAudioTracks()[0];

    if (!track) {
      return;
    }

    setAudio({ stream, paused: true });

    return track;
  };

  const getScreenTrack = async () => {
    if (screen.stream) {
      return;
    }

    const stream = await getScreenStream();

    const track = stream.getVideoTracks()[0];

    if (!track) {
      return;
    }

    setScreen({ stream, paused: false });

    return track;
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
      } catch (error) {
        // console.error('Error fetching media devices:', error);
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
  };
};

export default useMediaTracks;
