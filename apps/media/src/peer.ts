export class Peer {
  socketId: string;
  sendTransport: any;
  receiveTransport: any;
  producers: Map<string, any>;
  consumers: Map<string, any>;

  constructor(socketId: string) {
    this.socketId = socketId;
    this.sendTransport = null;
    this.receiveTransport = null;
    this.producers = new Map();
    this.consumers = new Map();
  }

  addSendTransport(transport) {
    this.sendTransport = transport;
  }

  addReceiveTransport(transport) {
    this.receiveTransport = transport;
  }

  getSendTransport() {
    return this.sendTransport;
  }

  getReceiveTransport() {
    return this.receiveTransport;
  }

  addProducer(producerId, producer) {
    this.producers.set(producerId, producer);
  }

  getProducer(producerId) {
    return this.producers.get(producerId);
  }

  addConsumer(consumerId, consumer) {
    this.consumers.set(consumerId, consumer);
  }

  getConsumer(consumerId) {
    return this.consumers.get(consumerId);
  }

  close() {
    if (this.sendTransport) this.sendTransport.close();
    if (this.receiveTransport) this.receiveTransport.close();
    this.producers.forEach((producer) => producer.close());
    this.consumers.forEach((consumer) => consumer.close());
  }
}
