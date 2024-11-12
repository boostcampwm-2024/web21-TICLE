import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class SignalingGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    client.broadcast.emit('message', `server response : ${payload.message}`);
    return `server response : ${payload.message}`;
  }
}
