import { ReactNode, useState } from 'react';

import { DummyStreamActionContext, DummyStreamStateContext } from '@/contexts/dummyStream/context';

interface DummyStreamProviderProps {
  children: ReactNode;
}

export const DummyStreamProvider = ({ children }: DummyStreamProviderProps) => {
  const [dummyStreams, setDummyStreams] = useState<{ socketId: string; nickname: string }[]>([]);

  const addDummyStream = (socketId: string, nickname: string) => {
    setDummyStreams((prev) => [...prev, { socketId, nickname }]);
  };

  const removeDummyStream = (socketId: string) => {
    setDummyStreams((prev) => prev.filter((stream) => stream.socketId !== socketId));
  };

  const state = { dummyStreams };
  const actions = { addDummyStream, removeDummyStream } as const;

  return (
    <DummyStreamStateContext.Provider value={state}>
      <DummyStreamActionContext.Provider value={actions}>
        {children}
      </DummyStreamActionContext.Provider>
    </DummyStreamStateContext.Provider>
  );
};
