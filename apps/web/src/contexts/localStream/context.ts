import { createContext, useContext } from 'react';
import { MediaTypes } from '@repo/mediasoup';

export interface LocalStream {
  stream: MediaStream | null;
  paused: boolean;
}

export interface MediaDevice {
  label: string;
  value: string;
}

interface LocalStreamState {
  audio: LocalStream;
  video: LocalStream;
  screen: LocalStream;

  videoDevices: MediaDevice[];
  audioDevices: MediaDevice[];
  audioOutputDevices: MediaDevice[];
  selectedVideoDeviceId: string | null;
  selectedAudioDeviceId: string | null;
  selectedAudioOutputDeviceId: string | null;
}

interface StreamActionContextProps {
  startCameraStream: () => void;
  startMicStream: () => void;
  startScreenStream: () => void;
  pauseStream: (type: MediaTypes) => void;
  resumeStream: (type: MediaTypes) => void;
  closeStream: (type: MediaTypes) => void;
  clearLocalStream: () => void;

  setSelectedVideoDeviceId: (deviceId: string) => void;
  setSelectedAudioDeviceId: (deviceId: string) => void;
  setSelectedAudioOutputDeviceId: (deviceId: string) => void;
}

export const LocalStreamStateContext = createContext<LocalStreamState | undefined>(undefined);
export const LocalStreamActionContext = createContext<StreamActionContextProps | undefined>(
  undefined
);

export const useLocalStreamState = (): LocalStreamState => {
  const state = useContext(LocalStreamStateContext);

  if (!state) {
    throw new Error('useStreamState must be used within a StreamProvider');
  }

  return state;
};

export const useLocalStreamAction = (): StreamActionContextProps => {
  const actions = useContext(LocalStreamActionContext);

  if (!actions) {
    throw new Error('useStreamAction must be used within a StreamProvider');
  }

  return actions;
};
