import * as os from 'os';

import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import { types } from 'mediasoup';
import { Socket } from 'socket.io';

import { RoomService } from 'src/room/room.service';
import { Room } from 'src/room/room';
import { Worker } from 'mediasoup/node/lib/types';
import { MediasoupConfig } from './config';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class MediasoupService implements OnModuleInit {
  private nextWorkerIndex = 0;
  private workers: Worker[] = [];
  private rooms: Map<string, Room> = new Map();

  constructor(
    private roomService: RoomService,
    private mediasoupConfig: MediasoupConfig,
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
    const worker = this.getWorker();
    const router = await worker.createRouter({
      mediaCodecs: this.mediasoupConfig.router.mediaCodecs,
    });
    return this.roomService.createRoom(roomId, router);
  }

  joinRoom(roomId: string, socketId: string) {
    const room = this.roomService.getRoom(roomId);
    if (room.isExistPeer(socketId)) {
      throw new Error(`Peer ${socketId} already exists`);
    }
    room.addPeer(socketId);

    return room.getRouter().rtpCapabilities;
  }

  async createTransport(roomId: string, socketId: string) {
    const room = this.roomService.getRoom(roomId);

    const router = room.getRouter();
    const transport = await router.createWebRtcTransport(
      this.mediasoupConfig.webRtcTransport,
    );
    room.getPeer(socketId).addTransport(transport);

    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    };
  }

  async connectTransport(
    dtlsParameters: types.DtlsParameters,
    transportId: string,
    roomId: string,
    socketId: string,
  ) {
    const room = this.rooms.get(roomId);

    const peer = room.getPeer(socketId);
    const transport = peer.getTransport(transportId);

    await transport.connect({ dtlsParameters });
  }

  async produce(
    id: string,
    kind: types.MediaKind,
    rtpParameters: types.RtpParameters,
    transportId: string,
    roomId: string,
  ) {
    const room = this.rooms.get(roomId);
    const peer = room.getPeer(id);
    const transport = peer.getTransport(transportId);
    const producer = await transport.produce({ kind, rtpParameters });

    peer.addProducer(producer);
    return producer;
  }

  async consume(
    id: string,
    producerId: string,
    roomId: string,
    transportId: string,
    rtpCapabilities: types.RtpCapabilities,
  ) {
    const room = this.rooms.get(roomId);
    const peer = room.getPeer(id);

    const transport = peer.getTransport(transportId);
    const consumer = await transport.consume({
      producerId,
      rtpCapabilities,
      paused: false,
    });

    peer.addConsumer(consumer);

    return {
      consumerId: consumer.id,
      producerId: consumer.producerId,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
    };
  }

  async getProducers(roomId: string, peerId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }

    const peer = room.getPeer(peerId);
    if (!peer) {
      throw new Error(`peer ${peerId} not found`);
    }

    const peers = [...room.peers.values()];

    const producers = peers
      .map((peer) => {
        return [...peer.producers.keys()];
      })
      .flat();

    return [...new Set(producers)];
  }
}
