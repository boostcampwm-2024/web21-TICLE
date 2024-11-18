import { Injectable } from '@nestjs/common';
import { Room } from './room';
import { Router } from 'mediasoup/node/lib/RouterTypes';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class RoomService {
  private rooms: Map<string, Room> = new Map();

  constructor() {}

  createRoom(roomId: string, router: Router) {
    if (this.rooms.has(roomId)) {
      return roomId;
    }
    const room = new Room(roomId, router);
    this.rooms.set(roomId, room);
    return roomId;
  }

  getRoom(roomId: string) {
    const room = this.rooms.get(roomId)
    if (!room) {
      throw new WsException(`방이 존재하지 않습니다.`);
    }
    return room;
  }

}
