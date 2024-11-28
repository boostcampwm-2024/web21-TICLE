import { useParams } from '@tanstack/react-router';
import type { client } from '@repo/mediasoup';
import { SOCKET_EVENTS } from '@repo/mediasoup';

import { useMediasoupState } from '@/contexts/mediasoup/context';
import useAuthStore from '@/stores/useAuthStore';

interface JoinRoomRes {
  rtpCapabilities: client.RtpCapabilities;
}
const useRoom = () => {
  const { socketRef } = useMediasoupState();
  const { ticleId: roomId } = useParams({ from: '/_authenticated/live/$ticleId' });
  const nickname = useAuthStore.getState().authInfo?.nickname;

  const createRoom = async () => {
    const socket = socketRef.current;

    if (!socket) return;

    return new Promise<client.RtpCapabilities>((resolve) => {
      socket.emit(SOCKET_EVENTS.createRoom, { roomId }, () => {
        socket.emit(
          SOCKET_EVENTS.joinRoom,
          { roomId, nickname },
          ({ rtpCapabilities }: JoinRoomRes) => {
            resolve(rtpCapabilities);
          }
        );
      });
    });
  };

  return { createRoom };
};

export default useRoom;
