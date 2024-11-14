
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MediasoupService } from 'src/mediasoup/mediasoup.service';

@WebSocketGateway()
export class SignalingGateway {
  constructor(private mediasoupService: MediasoupService) {}

  @SubscribeMessage('create-room')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
  ) {
    this.mediasoupService.createRoom(roomId);
    return { roomId };
  }

  @SubscribeMessage('join-room')
  joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
  ) {
    const rtpCapabilities = this.mediasoupService.joinRoom(roomId, client);
    return { rtpCapabilities };
  }

  @SubscribeMessage('create-transport')
  async createTransport(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
  ) {
    const transportOptions = await this.mediasoupService.createTransport(
      roomId,
      client,
    );
    return { transportOptions };
  }

  // @SubscribeMessage('connect-transport')

  // @SubscribeMessage('produce') //producer 만들어 달라고 요청 (자기가 쓰려고)

  // @SubscribeMessage('consume') // 방에있는 producer들을 Consumer로 받아오려고 요청
}
