import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): void {
    console.log(`Received message from client: ${payload}`);
    this.server.emit('message', `Server received: ${payload}`);
  }
}
