import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Router } from 'mediasoup/node/lib/RouterTypes';
import { ErrorMessage } from '@repo/types';

import { Room } from './room';

@Injectable()
export class RoomService {
  private rooms: Map<string, Room> = new Map();

  constructor() {}

  createRoom(roomId: string, router: Router) {
    const room = new Room(roomId, router);
    this.rooms.set(roomId, room);
    return roomId;
  }

  existRoom(roomId: string) {
    return this.rooms.has(roomId);
  }

  getRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new WsException(ErrorMessage.ROOM_NOT_FOUND);
    }
    return room;
  }

  deletePeer(socketId: string) {
    for (const [roomId, room] of this.rooms) {
      if (!room.removePeer(socketId)) continue;

      if (room.peers.size === 0) {
        room.close();
        this.rooms.delete(roomId);
      }

      return roomId;
    }
  }
}
