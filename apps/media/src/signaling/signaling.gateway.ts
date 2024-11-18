import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { MediasoupService } from 'src/mediasoup/mediasoup.service';
import { server } from '@repo/mediasoup';

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
    const rtpCapabilities = this.mediasoupService.joinRoom(roomId, client.id);
    return { rtpCapabilities };
  }

  @SubscribeMessage('create-transport')
  async createTransport(
    @ConnectedSocket() client: Socket,
    @MessageBody() createTransportDto: server.CreateTransportDto,
  ) {
    const transportOptions = await this.mediasoupService.createTransport(
      createTransportDto.roomId,
      client,
    );
    return { transportOptions };
  }

  @SubscribeMessage('connect-transport')
  async connectTransport(
    @ConnectedSocket() client: Socket,
    @MessageBody() connectTransportDto: server.ConnectTransportDto,
  ) {
    const socketId = client.id;
    const { transportId, dtlsParameters, roomId } = connectTransportDto;

    await this.mediasoupService.connectTransport(
      dtlsParameters,
      transportId,
      roomId,
      socketId,
    );

    return { message: 'success' };
  }

  @SubscribeMessage('produce')
  async handleProduce(
    @ConnectedSocket() client: Socket,
    @MessageBody() createProducerDto: server.CreateProducerDto,
  ) {
    const { transportId, kind, rtpParameters, roomId } = createProducerDto;
    const producer = await this.mediasoupService.produce(
      client.id,
      kind,
      rtpParameters,
      transportId,
      roomId,
    );

    client.to(roomId).emit('new-producer', {
      producerId: producer.id,
      peerId: client.id,
      kind,
    });

    return producer;
  }

  @SubscribeMessage('consume')
  async handleConsume(
    @ConnectedSocket() client: Socket,
    @MessageBody() createConsumerDto: server.CreateConsumerDto,
  ) {
    const { transportId, producerId, roomId, rtpCapabilities } =
      createConsumerDto;
    return this.mediasoupService.consume(
      client.id,
      producerId,
      roomId,
      transportId,
      rtpCapabilities,
    );
  }

  @SubscribeMessage('get-producer')
  async getProducers(
    @ConnectedSocket() client: Socket,
    @MessageBody() getProducerDto: server.GetProducersDto,
  ) {
    const { roomId } = getProducerDto;
    return this.mediasoupService.getProducers(roomId, client.id);
  }
}
