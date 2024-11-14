import { useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';

const useSocket = (url: string): Socket | null => {
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io(url);

    return () => {
      socket.current?.disconnect();
    };
  }, [url]);

  return socket.current;
};

export default useSocket;
