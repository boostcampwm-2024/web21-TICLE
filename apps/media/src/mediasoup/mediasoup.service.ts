import * as os from 'os';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as mediasoup from 'mediasoup';
import { types } from 'mediasoup';
import { Worker } from 'mediasoup/node/lib/types';
import { MediaTypes, server, STREAM_STATUS } from '@repo/mediasoup';
import { ErrorMessage } from '@repo/types';

import { RoomService } from '@/room/room.service';

import { MediasoupConfig } from './config';

@Injectable()
export class MediasoupService implements OnModuleInit {
  private nextWorkerIndex = 0;
  private workers: Worker[] = [];

  constructor(
    private roomService: RoomService,
    private mediasoupConfig: MediasoupConfig
  ) {}

  async onModuleInit() {
    const numWorkers = os.cpus().length;
    for (let i = 0; i < numWorkers; ++i) {
      await this.createWorker();
    }
  }

  private async createWorker() {
    const worker = await mediasoup.createWorker(this.mediasoupConfig.worker);

    worker.on('died', () => {
      console.error('mediasoup worker has died');
      setTimeout(() => process.exit(1), 2000);
    });

    this.workers.push(worker);

    return worker;
  }

  getWorker() {
    const worker = this.workers[this.nextWorkerIndex];
    this.nextWorkerIndex = (this.nextWorkerIndex + 1) % this.workers.length;
    return worker;
  }

  async createRoom(roomId: string) {
    const isExistRoom = this.roomService.existRoom(roomId);
    if (isExistRoom) {
      return roomId;
    }

    const worker = this.getWorker();
    const router = await worker.createRouter({
      mediaCodecs: this.mediasoupConfig.router.mediaCodecs,
    });

    return this.roomService.createRoom(roomId, router);
  }

  joinRoom(roomId: string, socketId: string, nickname: string) {
    const room = this.roomService.getRoom(roomId);

    if (room.hasPeer(socketId)) {
      throw new WsException(ErrorMessage.PEER_ALREADY_EXISTS_IN_ROOM);
    }

    room.addPeer(socketId, nickname);

    return room.getRouter().rtpCapabilities;
  }

  async createTransport(roomId: string, socketId: string) {
    const room = this.roomService.getRoom(roomId);
    const router = room.getRouter();
    const transport = await router.createWebRtcTransport(this.mediasoupConfig.webRtcTransport);

    room.getPeer(socketId).addTransport(transport);

    return {
      transportId: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    };
  }

  async connectTransport(
    dtlsParameters: types.DtlsParameters,
    transportId: string,
    roomId: string,
    socketId: string
  ) {
    const room = this.roomService.getRoom(roomId);
    const peer = room.getPeer(socketId);
    const transport = peer.getTransport(transportId);
    await transport.connect({ dtlsParameters });
  }

  async produce(
    socketId: string,
    kind: types.MediaKind,
    rtpParameters: types.RtpParameters,
    transportId: string,
    roomId: string,
    appData: { mediaTypes: MediaTypes }
  ) {
    const room = this.roomService.getRoom(roomId);
    const peer = room.getPeer(socketId);
    const transport = peer.getTransport(transportId);

    const producer = await transport.produce({
      kind,
      rtpParameters,
      appData,
      paused: appData.mediaTypes !== 'screen',
    });

    peer.addProducer(producer);

    return { nickname: peer.nickname, producerId: producer.id, paused: producer.paused };
  }

  disconnect(socketId: string) {
    const roomIds = this.roomService.deletePeer(socketId);

    return roomIds;
  }

  getProducers(roomId: string, socketId: string) {
    const room = this.roomService.getRoom(roomId);

    const peers = [...room.peers.values()];

    const filtered = peers.filter((peer) => peer.socketId !== socketId);

    const result = filtered.flatMap((peer) =>
      [...peer.producers.values()].map(({ id, kind, appData, paused }) => {
        return {
          producerId: id,
          peerId: peer.socketId,
          nickname: peer.nickname,
          kind,
          appData: { mediaTypes: appData.mediaTypes as MediaTypes },
          paused,
        };
      })
    );

    return [...new Set(result)];
  }

  changeProducerStatus(socketId: string, changeProducerState: server.ChangeProducerStateDto) {
    const { producerId, status, roomId } = changeProducerState;
    const room = this.roomService.getRoom(roomId);
    const peer = room.peers.get(socketId);
    const producer = peer.getProducer(producerId);

    if (status === STREAM_STATUS.pause) {
      producer.pause();
    } else {
      producer.resume();
    }

    return producerId;
  }

  async consume(
    socketId: string,
    { producerId, rtpCapabilities, roomId, transportId, appData, ...rest }: server.CreateConsumerDto
  ) {
    const room = this.roomService.getRoom(roomId);
    const peer = room.getPeer(socketId);
    const transport = peer.getTransport(transportId);

    const isExistConsumer = peer.checkConsumerByProducerId(producerId);

    if (!isExistConsumer) {
      return;
    }

    const consumer = await transport.consume({
      producerId,
      rtpCapabilities,
      paused: true,
      appData,
    });

    consumer.on('producerclose', () => {
      consumer.close();
      peer.consumers.delete(consumer.id);
    });

    consumer.on('producerpause', () => {
      consumer.pause();
    });

    consumer.on('producerresume', () => {
      if (consumer.kind !== 'audio') {
        return;
      }

      consumer.resume();
    });

    peer.addConsumer(consumer);

    return {
      peerId: peer.socketId,
      paused: consumer.paused,
      consumerId: consumer.id,
      producerId: consumer.producerId,
      kind: consumer.kind,
      appData: consumer.appData,
      rtpParameters: consumer.rtpParameters,
    };
  }

  async createConsumers(data: server.CreateConsumersDto) {
    const { socketId, roomId, rtpCapabilities, transportId, producers } = data;

    const targets = producers.filter((producer) => producer.peerId !== socketId);

    if (targets.length === 0) {
      return [];
    }

    return Promise.all(
      producers.map((producer) =>
        this.consume(socketId, {
          appData: producer.appData,
          producerId: producer.producerId,
          rtpCapabilities,
          roomId,
          transportId,
        })
      )
    );
  }

  async closeProducer(roomId: string, producerId: string, socketId: string) {
    const room = this.roomService.getRoom(roomId);
    const peer = room.peers.get(socketId);

    peer.deleteProducer(producerId);

    return producerId;
  }

  pauseConsumer(socketId: string, consumerId: string, roomId: string) {
    const room = this.roomService.getRoom(roomId);
    const peer = room.peers.get(socketId);
    const consumer = peer.getConsumer(consumerId);

    consumer.pause();

    return consumerId;
  }

  resumeConsumer(socketId: string, consumerId: string, roomId: string) {
    const room = this.roomService.getRoom(roomId);
    const peer = room.peers.get(socketId);
    const consumer = peer.getConsumer(consumerId);

    if (consumer.producerPaused) {
      return { paused: true };
    }

    consumer.resume();

    return { paused: false, consumerId, producerId: consumer.producerId };
  }

  pauseConsumers(socketId: string, roomId: string, consumerIds: string[]) {
    return consumerIds.map((consumerId) => this.pauseConsumer(socketId, consumerId, roomId));
  }

  resumeConsumers(socketId: string, roomId: string, consumerIds: string[]) {
    return consumerIds.map((consumerId) => this.resumeConsumer(socketId, consumerId, roomId));
  }
}
