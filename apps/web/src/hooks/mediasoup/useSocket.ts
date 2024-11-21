import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketType = Socket;

const useSocket = (url: string) => {
  const socketRef = useRef<SocketType | null>(null);

  // TODO: io 옵션 확인
  useEffect(() => {
    socketRef.current = io(url, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url]);

  return socketRef;
};

export default useSocket;
