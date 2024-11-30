import { types } from 'mediasoup';

export class RecordInfo {
  private plainTransport: types.PlainTransport;
  private recordConsumer: types.Consumer;

  constructor() {}
  setPlainTransport(plainTransport: types.PlainTransport) {
    this.plainTransport = plainTransport;
  }

  getPlainTransport() {
    return this.plainTransport;
  }

  setRecordConsumer(recordConsumer: types.Consumer) {
    this.recordConsumer = recordConsumer;
  }
}
