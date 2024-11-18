import { types } from 'mediasoup';

export class Peer {
  socketId: string;

  transports: Map<string, types.Transport>;
  producers: Map<string, types.Producer>;
  consumers: Map<string, types.Consumer>;

  constructor(socketId: string) {
    this.socketId = socketId;
    this.transports = new Map();
    this.producers = new Map();
    this.consumers = new Map();
  }

  addTransport(transport: types.Transport) {
    this.transports.set(transport.id, transport);
  }

  getTransport(transportId: string) {
    return this.transports.get(transportId);
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
    this.transports.forEach((transport) => transport.close());
    this.producers.forEach((producer) => producer.close());
    this.consumers.forEach((consumer) => consumer.close());
  }
}
