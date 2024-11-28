import { WsException } from '@nestjs/websockets';
import { Router } from 'mediasoup/node/lib/RouterTypes';
import { ErrorMessage } from '@repo/types';

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

  addPeer(socketId: string, nickname: string) {
    const peer = new Peer(socketId, nickname);
    this.peers.set(socketId, peer);
    return peer;
  }

  getPeer(socketId: string) {
    const peer = this.peers.get(socketId);

    if (!peer) {
      throw new WsException(ErrorMessage.PEER_NOT_FOUND_IN_ROOM);
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
