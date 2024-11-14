import type { types } from 'mediasoup-client';

export type Peer = {
  [key: string]: {
    stream: MediaStream;
  };
};

export type Device = types.Device;
export type RtpCapabilities = types.RtpCapabilities;

export type ProducerTransport = types.Transport;

export interface ConsumerTransport {
  remoteConsumerTransportId: string; // 서버 측에서 관리하는 Consumer transport의 ID
  remoteProducerId: string; // 수신하고 있는 미디어의 원본 Producer ID (누가 보내는 미디어인지)
  remoteConsumerId: string; // 수신하고 있는 미디어의 원본 Consumer ID (누가 보내는 미디어인지)
  consumer: types.Consumer; // 실제 미디어를 수신하는 Consumer 객체
  consumerTransport: types.Transport; // Consumer가 사용하는 transport 객체
}

export type Func = ([param]?: any) => void;
