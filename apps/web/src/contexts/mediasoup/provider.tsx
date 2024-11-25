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

  const disconnect = () => {
    const { recvTransport, sendTransport } = transportsRef.current;
    const { audio, video, screen } = producersRef.current;

    socketRef.current?.disconnect();

    sendTransport?.close();
    recvTransport?.close();

    audio?.close();
    video?.close();
    screen?.close();
  };

  const state = {
    socketRef,
    deviceRef,
    transportsRef,
    producersRef,
  };

  const actions = {
    disconnect,
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
