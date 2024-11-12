import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class SignalingGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {}
}
