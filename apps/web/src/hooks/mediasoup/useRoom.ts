import { Socket } from 'socket.io-client';
import type { client } from '@repo/mediasoup';
import { SOCKET_EVENTS } from '@repo/mediasoup';

const useRoom = (socket: Socket | null, roomId: string) => {
  const createRoom = async () => {
    if (!socket) return;

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
