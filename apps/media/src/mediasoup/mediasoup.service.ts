import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import * as os from 'os';
import { Socket } from 'socket.io';
import { config } from 'src/config';
import { Room } from 'src/room';

@Injectable()
export class MediasoupService implements OnModuleInit {
  private nextWorkerIndex = 0;
  private workers = [];
  private rooms: Map<string, Room> = new Map();

  constructor() {}

  public async onModuleInit() {
    const numWorkers = os.cpus().length;
    for (let i = 0; i < numWorkers; ++i) {
      await this.createWorker();
    }
  }

  private async createWorker() {
    const worker = await mediasoup.createWorker({
      logLevel: 'warn',
      rtcMinPort: 6002,
      rtcMaxPort: 6202,
    });

    worker.on('died', () => {
      console.error('mediasoup worker has died');
      setTimeout(() => process.exit(1), 2000);
    });

    this.workers.push({ worker, routers: new Map() });
    return worker;
  }

  public getWorker() {
    const worker = this.workers[this.nextWorkerIndex].worker;
    this.nextWorkerIndex = (this.nextWorkerIndex + 1) % this.workers.length;
    return worker;
  }

  public async createRoom(roomId: string) {
    const worker = this.getWorker();

    const room = new Room(roomId);
    this.rooms.set(roomId, room);
    await room.init(worker);
    return roomId;
  }

  public joinRoom(roomId: string, socket: Socket) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }
    if (room.peers.has(socket.id)) {
      throw new Error(`Peer ${socket.id} already exists`);
    }
    room.addPeer(socket.id);

    return room.getRouter().rtpCapabilities;
  }

  public async createTransport(roomId: string, socket: Socket) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error(`Room ${roomId} not found`);
    }
    const router = room.getRouter();
    const transport = await router.createWebRtcTransport(
      config.mediasoup.webRtcTransport,
    );
    room.getPeer(socket.id).addSendTransport(transport);

    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    };
  }
}
