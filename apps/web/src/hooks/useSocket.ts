import { MutableRefObject, useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';

type UseSocketResult = MutableRefObject<Socket | null>;

const useSocket = (url: string): UseSocketResult => {
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io(url);

    return () => {
      socket.current?.disconnect();
    };
  }, [url]);

  return socket;
};

export default useSocket;
