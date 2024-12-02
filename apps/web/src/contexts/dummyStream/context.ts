import { createContext, useContext } from 'react';

interface DummyStreamState {
  dummyStreams: { socketId: string; nickname: string }[];
}

interface MediasoupActionContextProps {
  addDummyStream: (socketId: string, nickname: string) => void;
  removeDummyStream: (socketId: string) => void;
}

export const DummyStreamStateContext = createContext<DummyStreamState | undefined>(undefined);
export const DummyStreamActionContext = createContext<MediasoupActionContextProps | undefined>(
  undefined
);

export const useDummyStreamState = (): DummyStreamState => {
  const state = useContext(DummyStreamStateContext);

  if (!state) {
    throw new Error('useDummyStreamState must be used within a DummyStreamProvider');
  }

  return state;
};

export const useDummyStreamAction = (): MediasoupActionContextProps => {
  const actions = useContext(DummyStreamActionContext);

  if (!actions) {
    throw new Error('useDummyStreamAction must be used within a DummyStreamProvider');
  }

  return actions;
};
