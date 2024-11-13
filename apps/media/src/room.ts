import { Worker } from 'mediasoup/node/lib/types';
import { config } from './config';
import { Peer } from './peer';
export class Room {
  id: string;
  router: any;
  peers: Map<string, Peer>;
  constructor(roomId: string) {
    this.id = roomId;
    this.router = null;
    this.peers = new Map();
  }

  async init(worker: Worker) {
    this.router = await worker.createRouter({
      mediaCodecs: config.mediasoup.router.mediaCodecs,
    });
    return this.router;
  }

  getRouter() {
    return this.router;
  }

  addPeer(socketId) {
    const peer = new Peer(socketId);
    this.peers.set(socketId, peer);
    return peer;
  }

  getPeer(socketId) {
    return this.peers.get(socketId);
  }

  removePeer(socketId) {
    const peer = this.peers.get(socketId);
    if (peer) {
      peer.close();
      this.peers.delete(socketId);
    }
  }

  close() {
    this.peers.forEach((peer) => peer.close());
    this.peers.clear();
    if (this.router) this.router.close();
  }
}
