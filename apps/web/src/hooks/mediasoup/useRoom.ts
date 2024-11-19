import { MutableRefObject } from 'react';
import { Socket } from 'socket.io-client';
import type { client } from '@repo/mediasoup';
import { SOCKET_EVENTS } from '@repo/mediasoup';

const useRoom = (socketRef: MutableRefObject<Socket | null>, roomId: string) => {
  const createRoom = async () => {
    if (!socketRef.current) return;

    const socket = socketRef.current;
    return new Promise<client.RtpCapabilities>((resolve) => {
      socket.emit(SOCKET_EVENTS.createRoom, { roomId }, () => {
        socket.emit(
          SOCKET_EVENTS.joinRoom,
          { roomId },
          async ({ rtpCapabilities }: { rtpCapabilities: client.RtpCapabilities }) => {
            resolve(rtpCapabilities);
          }
        );
      });
    });
  };

  return { createRoom };
};

export default useRoom;
