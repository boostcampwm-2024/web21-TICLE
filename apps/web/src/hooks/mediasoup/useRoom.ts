import { useParams } from '@tanstack/react-router';
import type { client } from '@repo/mediasoup';
import { SOCKET_EVENTS } from '@repo/mediasoup';

import { useMediasoupState } from '@/contexts/mediasoup/context';

interface JoinRoomRes {
  rtpCapabilities: client.RtpCapabilities;
}
const useRoom = () => {
  const { socketRef } = useMediasoupState();
  const { ticleId: roomId } = useParams({ from: '/_authenticated/live/$ticleId' });

  const createRoom = async () => {
    const socket = socketRef.current;

    if (!socket) return;

    const data = { roomId };

    return new Promise<client.RtpCapabilities>((resolve) => {
      socket.emit(SOCKET_EVENTS.createRoom, data, () => {
        socket.emit(SOCKET_EVENTS.joinRoom, data, ({ rtpCapabilities }: JoinRoomRes) => {
          resolve(rtpCapabilities);
        });
      });
    });
  };

  return { createRoom };
};

export default useRoom;
