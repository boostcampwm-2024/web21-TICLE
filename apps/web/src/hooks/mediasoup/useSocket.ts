import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '@repo/mediasoup';

import { ENV } from '@/constants/env';
import { useMediasoupAction } from '@/contexts/mediasoup/context';

const SOCKET_OPTIONS = {
  transports: ['websocket', 'polling'],
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
};

type SocketType = Socket;

const useSocket = () => {
  const { dispatch } = useMediasoupAction();

  const [isConnected, setIsConnected] = useState(false);
  const [isError, setIsError] = useState<Error | null>(null);

  const initSocket = useCallback(() => {
    const socket = io(ENV.WS_URL, SOCKET_OPTIONS);

    dispatch({ type: 'SET_SOCKET', payload: socket });

    return socket;
  }, [dispatch]);

  const initSocketEvents = useCallback((socket: SocketType) => {
    socket.on(SOCKET_EVENTS.connect, () => {
      setIsConnected(true);
      setIsError(null);
    });

    socket.on(SOCKET_EVENTS.disconnect, () => {
      setIsConnected(false);
      setIsError(null);
    });

    socket.on(SOCKET_EVENTS.connectError, (error) => {
      setIsConnected(false);
      setIsError(new Error(`socket connection error: ${error}`));
    });
  }, []);

  useEffect(() => {
    const socket = initSocket();

    if (socket) {
      initSocketEvents(socket);
    }

    return () => {
      socket?.disconnect();
    };
  }, [initSocket, initSocketEvents]);

  return { isConnected, isError };
};

export default useSocket;
