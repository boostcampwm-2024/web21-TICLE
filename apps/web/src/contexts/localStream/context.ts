import { createContext, useContext } from 'react';
import { MediaTypes } from '@repo/mediasoup';

export interface LocalStream {
  stream: MediaStream | null;
  paused: boolean;
}

interface LocalStreamState {
  audio: LocalStream;
  video: LocalStream;
  screen: LocalStream;
}

interface StreamActionContextProps {
  startCameraStream: () => void;
  startMicStream: () => void;
  startScreenStream: () => void;
  closeScreenStream: () => void;
  pauseStream: (type: MediaTypes) => void;
  resumeStream: (type: MediaTypes) => void;
  closeStream: (type: MediaTypes) => void;
  closeLocalStream: () => void;
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
