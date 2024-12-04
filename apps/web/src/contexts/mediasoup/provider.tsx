import { ReactNode } from '@tanstack/react-router';

import { MediasoupActionContext, MediasoupStateContext } from '@/contexts/mediasoup/context';
import useDevice from '@/hooks/mediasoup/useDevice';
import useProducer from '@/hooks/mediasoup/useProducer';
import useSocket from '@/hooks/mediasoup/useSocket';
import useTransport from '@/hooks/mediasoup/useTransport';

interface MediasoupProviderProps {
  children: ReactNode;
}

export const MediasoupProvider = ({ children }: MediasoupProviderProps) => {
  const { socketRef, isConnected, isError } = useSocket();

  const { deviceRef, createDevice } = useDevice();

  const { transportsRef, createRecvTransport, createSendTransport } = useTransport(socketRef);

  const {
    producersRef,
    createProducer,
    closeProducer,
    pauseProducer,
    resumeProducer,
    connectExistProducer,
  } = useProducer({ socketRef, transportsRef });

  const clearMediasoup = () => {
    const { recvTransport, sendTransport } = transportsRef.current;

    sendTransport?.close();
    recvTransport?.close();

    socketRef.current?.disconnect();

    socketRef.current = null;
    deviceRef.current = null;
    transportsRef.current = { sendTransport: null, recvTransport: null };
  };

  const state = {
    socketRef,
    deviceRef,
    transportsRef,
    producersRef,
    isConnected,
    isError,
  };

  const actions = {
    clearMediasoup,
    createDevice,
    createRecvTransport,
    createSendTransport,
    createProducer,
    closeProducer,
    pauseProducer,
    resumeProducer,
    connectExistProducer,
  } as const;

  return (
    <MediasoupStateContext.Provider value={state}>
      <MediasoupActionContext.Provider value={actions}>{children}</MediasoupActionContext.Provider>
    </MediasoupStateContext.Provider>
  );
};
