import { useState } from 'react';
import { MediaTypes } from '@repo/mediasoup';

import { LocalStream } from '@/contexts/localStream/context';
import { useMediasoupAction } from '@/contexts/mediasoup/context';
import { getCameraStream, getMicStream, getScreenStream } from '@/utils/stream';

const DEFAULT_LOCAL_STREAM = {
  stream: null,
  paused: false,
} as const;

const useLocalStream = () => {
  const [video, setVideo] = useState<LocalStream>({ ...DEFAULT_LOCAL_STREAM });
  const [audio, setAudio] = useState<LocalStream>({ ...DEFAULT_LOCAL_STREAM });
  const [screen, setScreen] = useState<LocalStream>({ ...DEFAULT_LOCAL_STREAM });

  const getState = (type: MediaTypes) => {
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

  const { createProducer, closeProducer, resumeProducer, pauseProducer } = useMediasoupAction();

  const startCameraStream = async () => {
    if (video.stream) {
      return;
    }

    const stream = await getCameraStream();

    const track = stream.getVideoTracks()[0];

    if (!track) {
      return;
    }

    setVideo({ stream, paused: true });

    return createProducer('video', track);
  };

  const startMicStream = async () => {
    if (audio.stream) {
      return;
    }

    const stream = await getMicStream();
    const track = stream.getAudioTracks()[0];

    if (!track) {
      return;
    }

    setAudio({ stream, paused: true });
    return createProducer('audio', track);
  };

  const startScreenStream = async () => {
    if (screen.stream) {
      return;
    }

    const stream = await getScreenStream();

    const track = stream.getVideoTracks()[0];

    if (!track) {
      return;
    }

    track.onended = () => {
      track.stop();
      closeStream('screen');
      closeProducer('screen');
    };

    setScreen({ stream, paused: true });

    return createProducer('screen', track);
  };

  const closeStream = (type: MediaTypes) => {
    const [localStream, setLocalStream] = getState(type);

    const { stream } = localStream;

    setLocalStream({ stream: null, paused: false });

    if (!stream) {
      return;
    }

    stream.getTracks().forEach((track) => {
      track.stop();
    });

    setLocalStream({ stream: null, paused: false });
    closeProducer(type);
  };

  const pauseStream = (type: MediaTypes) => {
    const [localStream, setLocalStream] = getState(type);

    const { stream } = localStream;

    setLocalStream({ stream, paused: true });

    if (!stream) {
      return;
    }

    stream.getTracks().forEach((track) => {
      track.enabled = false;
    });

    pauseProducer(type);
  };

  const resumeStream = (type: MediaTypes) => {
    const [localStream, setLocalStream] = getState(type);

    const { stream } = localStream;

    setLocalStream({ stream, paused: false });

    if (!stream) {
      return;
    }

    stream.getTracks().forEach((track) => {
      track.enabled = true;
    });

    resumeProducer(type);
  };

  return {
    video,
    audio,
    screen,
    startCameraStream,
    startMicStream,
    startScreenStream,
    closeStream,
    pauseStream,
    resumeStream,
  } as const;
};

export default useLocalStream;
