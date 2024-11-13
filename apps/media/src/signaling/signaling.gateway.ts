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
    @MessageBody() roomId: string,
  ) {
    this.mediasoupService.createRoom(roomId);
    client.emit('room-created', roomId);
  }

  @SubscribeMessage('join-room')
  joinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
    const rtpCapabilities = this.mediasoupService.joinRoom(roomId, client);
    client.emit('rtp-capabilities', rtpCapabilities);
  }

  // @SubscribeMessage('create-transport')

  // @SubscribeMessage('connect-transport')

  // @SubscribeMessage('produce') //producer 만들어 달라고 요청 (자기가 쓰려고)

  // @SubscribeMessage('consume') // 방에있는 producer들을 Consumer로 받아오려고 요청
}
