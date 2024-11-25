import { WsException } from '@nestjs/websockets';
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
      throw new WsException(`transport가 존재하지 않습니다.`);
    }
    return transport;
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

  close() {
    this.consumers.forEach((consumer) => consumer.close());
    this.producers.forEach((producer) => producer.close());
    this.transports.forEach((transport) => transport.close());
  }
}
