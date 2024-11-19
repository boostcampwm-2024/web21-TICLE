import { WsException } from '@nestjs/websockets';
import { Router } from 'mediasoup/node/lib/RouterTypes';

import { Peer } from './peer';

export class Room {
  id: string;
  router: Router;
  peers: Map<string, Peer>;
  constructor(roomId: string, router: Router) {
    this.id = roomId;
    this.router = router;
    this.peers = new Map();
  }

  getRouter() {
    return this.router;
  }

  addPeer(socketId: string) {
    const peer = new Peer(socketId);
    this.peers.set(socketId, peer);
    return peer;
  }

  getPeer(socketId: string) {
    const peer = this.peers.get(socketId);
    if (!peer) {
      throw new WsException(`방에 피어가 존재하지 않습니다.`);
    }
    return peer;
  }

  hasPeer(socketId: string) {
    return this.peers.has(socketId);
  }

  removePeer(socketId: string) {
    const peer = this.peers.get(socketId);
    if (peer) {
      peer.close();
      this.peers.delete(socketId);
      return true;
    }
    return false;
  }

  close() {
    this.peers.forEach((peer) => peer.close());
    this.peers.clear();
    if (this.router) this.router.close();
  }
}
