import { useEffect } from 'react';
import { MediaTypes } from '@repo/mediasoup';

import { useMediasoupAction } from '@/contexts/mediasoup/context';
import { toast } from '@/core/toast';
import useMediaTracks from '@/hooks/useMediaTracks';
import { renderError } from '@/utils/toast/renderMessage';

const DEFAULT_LOCAL_STREAM = {
  stream: null,
  paused: true,
} as const;

const useLocalStream = () => {
  const {
    video,
    audio,
    screen,

    getAudioTrack,
    getCameraTrack,
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
  } = useMediaTracks();

  const { createProducer, closeProducer, resumeProducer, pauseProducer } = useMediasoupAction();

  const startCameraStream = async () => {
    try {
      const track = await getCameraTrack();

      if (!track) {
        throw new Error();
      }

      return createProducer('video', track);
    } catch (e) {
      toast(renderError('카메라를 찾을 수 없습니다.'));
      closeStream('video');
      throw e;
    }
  };

  const startMicStream = async () => {
    try {
      const track = await getAudioTrack();

      if (!track) {
        throw new Error();
      }
      return createProducer('audio', track);
    } catch (e) {
      toast(renderError('마이크를 찾을 수 없습니다.'));
      closeStream('audio');
      throw e;
    }
  };

  const startScreenStream = async () => {
    try {
      const track = await getScreenTrack();

      if (!track) {
        throw new Error();
      }

      track.onended = () => {
        track.stop();
        closeStream('screen');
        closeProducer('screen');
      };

      return createProducer('screen', track);
    } catch (e) {
      toast(renderError('화면 공유를 시작할 수 없습니다.'));
      closeStream('screen');
      throw e;
    }
  };

  const closeScreenStream = () => {
    const [localStream, setLocalStream] = getMediaState('screen');
    const { stream } = localStream;

    setLocalStream({ ...DEFAULT_LOCAL_STREAM });

    if (!stream) {
      return;
    }

    closeProducer('screen');

    stream.getTracks().forEach((track) => {
      track.stop();
    });
  };

  const closeStream = (type: MediaTypes) => {
    const [localStream, setLocalStream] = getMediaState(type);

    const { stream } = localStream;

    setLocalStream({ ...DEFAULT_LOCAL_STREAM });

    if (!stream) {
      return;
    }

    closeProducer(type);

    stream.getTracks().forEach((track) => {
      track.stop();
    });
  };

  const pauseStream = (type: MediaTypes) => {
    const [localStream, setLocalStream] = getMediaState(type);

    const { stream } = localStream;

    setLocalStream({ stream, paused: true });

    if (!stream) {
      return;
    }

    pauseProducer(type);

    stream.getTracks().forEach((track) => {
      track.enabled = false;
    });
  };

  const resumeStream = (type: MediaTypes) => {
    const [localStream, setLocalStream] = getMediaState(type);

    const { stream } = localStream;

    setLocalStream({ stream, paused: false });

    if (!stream) {
      return;
    }

    resumeProducer(type);

    stream.getTracks().forEach((track) => {
      track.enabled = true;
    });
  };

  const closeLocalStream = () => {
    closeStream('video');
    closeStream('audio');
    closeStream('screen');
  };

  useEffect(() => {
    if (!selectedVideoDeviceId) return;

    const videoTrack = video.stream?.getVideoTracks()[0];

    if (!videoTrack) return;

    const isSameDevice = videoTrack.getSettings().deviceId === selectedVideoDeviceId;

    if (isSameDevice) return;

    closeStream('video');
    startCameraStream();
  }, [selectedVideoDeviceId]);

  useEffect(() => {
    if (!selectedAudioDeviceId) return;

    const audioTrack = audio.stream?.getAudioTracks()[0];

    if (!audioTrack) return;

    const isSameDevice = audioTrack.getSettings().deviceId === selectedAudioDeviceId;

    if (isSameDevice) return;

    closeStream('audio');
    startMicStream();
  }, [selectedAudioDeviceId]);

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
    closeScreenStream,
    closeLocalStream,

    videoDevices,
    audioDevices,
    audioOutputDevices,

    selectedVideoDeviceId,
    selectedAudioDeviceId,
    selectedAudioOutputDeviceId,

    setSelectedVideoDeviceId,
    setSelectedAudioDeviceId,
    setSelectedAudioOutputDeviceId,
  } as const;
};

export default useLocalStream;
