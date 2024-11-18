import { useRef } from 'react';
import { Socket } from 'socket.io-client';
import { SOCKET_EVENTS, TRANSPORT_EVENTS } from '@repo/mediasoup';
import type { client } from '@repo/mediasoup';

type Transport = client.BaseTransport;

const useTransport = (socket: Socket | null, roomId: string) => {
  const sendTransportRef = useRef<Transport | null>(null);
  const recvTransportRef = useRef<Transport | null>(null);

  const createSendTransport = (device: client.Device) => {
    if (!socket) return;

    socket.emit(SOCKET_EVENTS.createTransport, { roomId }, (result: client.CreateTransportRes) => {
      const { transportId, ...rest } = result;
      const transport = device.createSendTransport({ id: transportId, ...rest });

      sendTransportRef.current = transport;

      transport.on(TRANSPORT_EVENTS.connect, ({ dtlsParameters }, callback) => {
        socket.emit(SOCKET_EVENTS.connectTransport, { dtlsParameters, transportId, roomId });
        callback();
      });

      transport.on(TRANSPORT_EVENTS.produce, ({ rtpParameters, kind }, callback) => {
        socket.emit(
          SOCKET_EVENTS.produce,
          { rtpParameters, kind, transportId, roomId },
          ({ producerId }: { producerId: string }) => {
            callback({ id: producerId });
          }
        );
      });
    });
  };

  const createRecvTransport = (device: client.Device) => {
    if (!socket) return;

    socket.emit(SOCKET_EVENTS.createTransport, { roomId }, (result: client.CreateTransportRes) => {
      const { transportId, ...rest } = result;

      const transport = device.createRecvTransport({ id: transportId, ...rest });

      recvTransportRef.current = transport;

      transport.on(TRANSPORT_EVENTS.connect, ({ dtlsParameters }, callback) => {
        socket.emit(SOCKET_EVENTS.connectTransport, { dtlsParameters, transportId, roomId });
        callback();
      });
    });
  };

  return { sendTransportRef, recvTransportRef, createRecvTransport, createSendTransport };
};

export default useTransport;
