import { useParams } from '@tanstack/react-router';
import { MutableRefObject, useRef } from 'react';
import { Socket } from 'socket.io-client';
import type { client } from '@repo/mediasoup';
import { SOCKET_EVENTS, TRANSPORT_EVENTS } from '@repo/mediasoup';

interface TransportRef {
  sendTransport: client.BaseTransport | null;
  recvTransport: client.BaseTransport | null;
}

const useTransport = (socketRef: MutableRefObject<Socket | null>) => {
  const { ticleId: roomId } = useParams({ from: '/_authenticated/live/$ticleId' });

  const transportsRef = useRef<TransportRef>({
    sendTransport: null,
    recvTransport: null,
  });

  const createSendTransport = async (device: client.Device) => {
    const socket = socketRef.current;

    if (!socket) return;

    return new Promise<void>((resolve) => {
      socket.emit(
        SOCKET_EVENTS.createTransport,
        { roomId },
        async (result: client.CreateTransportRes) => {
          const { transportId, ...rest } = result;

          const transport = device.createSendTransport({ id: transportId, ...rest });

          transportsRef.current.sendTransport = transport;

          connectTransport(transport, transportId);
          produceTransport(transport, transportId);

          resolve();
        }
      );
    });
  };

  const createRecvTransport = async (device: client.Device) => {
    const socket = socketRef.current;

    if (!socket) return;

    return new Promise<void>((resolve) => {
      socket.emit(
        SOCKET_EVENTS.createTransport,
        { roomId },
        async (result: client.CreateTransportRes) => {
          const { transportId, ...rest } = result;

          const transport = device.createRecvTransport({ id: transportId, ...rest });

          transportsRef.current.recvTransport = transport;

          connectTransport(transport, transportId);

          resolve();
        }
      );
    });
  };

  const connectTransport = async (transport: client.BaseTransport, transportId: string) => {
    const socket = socketRef.current;

    if (!socket) return;

    transport.on(TRANSPORT_EVENTS.connect, ({ dtlsParameters }, callback) => {
      socket.emit(SOCKET_EVENTS.connectTransport, { dtlsParameters, transportId, roomId });
      callback();
    });
  };

  const produceTransport = async (transport: client.BaseTransport, transportId: string) => {
    const socket = socketRef.current;

    if (!socket) return;

    transport.on(TRANSPORT_EVENTS.produce, ({ rtpParameters, kind, appData }, callback) => {
      const data = { rtpParameters, kind, transportId, roomId, appData };

      socket.emit(SOCKET_EVENTS.produce, data, ({ producerId }: { producerId: string }) => {
        callback({ id: producerId });
      });
    });
  };

  return {
    transportsRef,
    createSendTransport,
    createRecvTransport,
  };
};

export default useTransport;
