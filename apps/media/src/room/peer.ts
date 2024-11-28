import { WsException } from '@nestjs/websockets';
import { ErrorMessage } from '@repo/types';
import { types } from 'mediasoup';

export class Peer {
  socketId: string;
  nickname: string;
  transports: Map<string, types.Transport>;
  producers: Map<string, types.Producer>;
  consumers: Map<string, types.Consumer>;

  constructor(socketId: string, nickname: string) {
    this.socketId = socketId;
    this.nickname = nickname;
    this.transports = new Map();
    this.producers = new Map();
    this.consumers = new Map();
  }

  addTransport(transport: types.Transport) {
    this.transports.set(transport.id, transport);
  }

  getTransport(transportId: string) {
    const transport = this.transports.get(transportId);
    if (!transport) {
      throw new WsException(ErrorMessage.TRANSPORT_NOT_FOUND);
    }
    return transport;
  }

  checkConsumerByProducerId(producerId: string) {
    const consumer = Array.from(this.consumers.values()).find(
      (consumer) => consumer.producerId === producerId
    );

    return !Boolean(consumer);
  }

  addProducer(producer: types.Producer) {
    this.producers.set(producer.id, producer);
  }

  getProducer(producerId: string) {
    return this.producers.get(producerId);
  }

  addConsumer(consumer: types.Consumer) {
    this.consumers.set(consumer.id, consumer);
  }

  getConsumer(consumerId: string) {
    return this.consumers.get(consumerId);
  }

  deleteProducer(producerId: string) {
    const producer = this.producers.get(producerId);

    if (!producer) {
      return;
    }

    producer.close();

    this.producers.delete(producerId);
  }

  getConsumerByProducerId(producerId: string) {
    const consumer = Array.from(this.consumers.values()).find(
      (consumer) => consumer.producerId === producerId
    );

    return consumer;
  }

  pauseConsumerByProducerId(producerId: string) {
    const consumer = this.getConsumerByProducerId(producerId);

    if (!consumer) {
      return;
    }

    consumer.pause();
  }

  resumeConsumerByProducerId(producerId: string) {
    const consumer = this.getConsumerByProducerId(producerId);

    if (!consumer) {
      return;
    }

    consumer.resume();
  }

  close() {
    this.consumers.forEach((consumer) => consumer.close());
    this.producers.forEach((producer) => producer.close());
    this.transports.forEach((transport) => transport.close());
  }
}
