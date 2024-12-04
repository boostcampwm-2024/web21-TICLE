import { useNavigate } from '@tanstack/react-router';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '@repo/mediasoup';

import { ENV } from '@/constants/env';
import { toast } from '@/core/toast';
import { renderError } from '@/utils/toast/renderMessage';

const SOCKET_OPTIONS = {
  transports: ['websocket', 'polling'],
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
};

interface UseSocketReturn {
  socketRef: MutableRefObject<Socket | null>;
  isConnected: boolean;
  isError: Error | null;
}

const useSocket = (): UseSocketReturn => {
  const navigate = useNavigate({ from: '/live/$ticleId' });

  const socketRef = useRef<Socket | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isError, setIsError] = useState<Error | null>(null);

  const initSocket = useCallback(() => {
    const socket = io(ENV.WS_URL, SOCKET_OPTIONS);

    socketRef.current = socket;

    return socket;
  }, []);

  const initSocketEvents = useCallback(
    (socket: Socket) => {
      socket.on(SOCKET_EVENTS.error, (result) => {
        toast(renderError(result.error.message));
      });

      socket.on(SOCKET_EVENTS.connect, () => {
        setIsConnected(true);
        setIsError(null);
      });

      socket.on(SOCKET_EVENTS.disconnect, () => {
        navigate({ to: '/', replace: true });
        setIsConnected(false);
        setIsError(null);
      });

      socket.on(SOCKET_EVENTS.connectError, (error) => {
        setIsConnected(false);
        setIsError(new Error(`socket connection error: ${error}`));
      });

      socket.on(SOCKET_EVENTS.roomClosed, () => {
        navigate({ to: '/', replace: true });
        toast(renderError('티클이 종료되었습니다.'));
        setIsConnected(false);
        setIsError(null);
      });
    },
    [navigate]
  );

  useEffect(() => {
    const socket = initSocket();

    initSocketEvents(socket);
  }, [initSocket, initSocketEvents]);

  return { socketRef, isConnected, isError };
};

export default useSocket;
