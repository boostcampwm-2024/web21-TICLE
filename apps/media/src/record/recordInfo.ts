import { types } from 'mediasoup';

export class RecordInfo {
  plainTransport: types.PlainTransport;

  constructor() {}
  setPlainTransport(plainTransport: types.PlainTransport) {
    this.plainTransport = plainTransport;
  }
}
