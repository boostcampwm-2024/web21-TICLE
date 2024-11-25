import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SOCKET_EVENTS, STREAM_STATUS } from '@repo/mediasoup';
import type { client, server } from '@repo/mediasoup';

import { MediasoupService } from '@/mediasoup/mediasoup.service';

@WebSocketGateway()
export class SignalingGateway implements OnGatewayDisconnect {
  constructor(private mediasoupService: MediasoupService) {}

  @SubscribeMessage(SOCKET_EVENTS.createRoom)
  async handleCreateRoom(@ConnectedSocket() client: Socket, @MessageBody('roomId') roomId: string) {
    await this.mediasoupService.createRoom(roomId);
    return { roomId };
  }

  @SubscribeMessage(SOCKET_EVENTS.joinRoom)
  joinRoom(@ConnectedSocket() client: Socket, @MessageBody() joinRoomDto: server.JoinRoomDto) {
    const { roomId, nickname } = joinRoomDto;
    client.join(roomId);
    const rtpCapabilities = this.mediasoupService.joinRoom(roomId, client.id, nickname);
    client.to(roomId).emit(SOCKET_EVENTS.newPeer, { peerId: client.id });
    return { rtpCapabilities };
  }

  @SubscribeMessage(SOCKET_EVENTS.createTransport)
  async createTransport(
    @ConnectedSocket() client: Socket,
    @MessageBody() createTransportDto: server.CreateTransportDto
  ): Promise<client.CreateTransportRes> {
    const transportOptions = await this.mediasoupService.createTransport(
      createTransportDto.roomId,
      client.id
    );
    return transportOptions;
  }

  @SubscribeMessage(SOCKET_EVENTS.connectTransport)
  async connectTransport(
    @ConnectedSocket() client: Socket,
    @MessageBody() connectTransportDto: server.ConnectTransportDto
  ) {
    const socketId = client.id;
    const { transportId, dtlsParameters, roomId } = connectTransportDto;

    await this.mediasoupService.connectTransport(dtlsParameters, transportId, roomId, socketId);

    return { message: 'success' };
  }

  @SubscribeMessage(SOCKET_EVENTS.produce)
  async handleProduce(
    @ConnectedSocket() client: Socket,
    @MessageBody() createProducerDto: server.CreateProducerDto
  ): Promise<client.CreateProducerRes> {
    const { transportId, kind, rtpParameters, roomId, appData } = createProducerDto;
    const producer = await this.mediasoupService.produce(
      client.id,
      kind,
      rtpParameters,
      transportId,
      roomId,
      appData
    );

    const createProducerRes = {
      producerId: producer.id,
      peerId: client.id,
      kind,
      appData,
      paused: producer.paused,
    };

    client.to(roomId).emit(SOCKET_EVENTS.newProducer, createProducerRes);

    return createProducerRes;
  }

  @SubscribeMessage(SOCKET_EVENTS.consume)
  async handleConsume(
    @ConnectedSocket() client: Socket,
    @MessageBody() createConsumerDto: server.CreateConsumerDto
  ): Promise<client.CreateConsumerRes> {
    const { transportId, producerId, roomId, rtpCapabilities } = createConsumerDto;

    const createConsumerRes = this.mediasoupService.consume(
      client.id,
      producerId,
      roomId,
      transportId,
      rtpCapabilities
    );
    return createConsumerRes;
  }

  @SubscribeMessage(SOCKET_EVENTS.getProducer)
  async getProducers(
    @ConnectedSocket() client: Socket,
    @MessageBody() getProducerDto: server.GetProducersDto
  ) {
    const { roomId } = getProducerDto;
    return this.mediasoupService.getProducers(roomId, client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const roomId = this.mediasoupService.disconnect(client.id);

    client.to(roomId).emit(SOCKET_EVENTS.peerLeft, { peerId: client.id });
  }

  @SubscribeMessage(SOCKET_EVENTS.closeProducer)
  closeProducer(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
    @MessageBody('producerId') producerId: string
  ) {
    this.mediasoupService.disconnectProducer(roomId, producerId, client.id);

    client.to(roomId).emit(SOCKET_EVENTS.producerClosed, { producerId });
  }

  @SubscribeMessage(SOCKET_EVENTS.producerStatusChange)
  pauseProducer(
    @ConnectedSocket() client: Socket,
    @MessageBody() changeProducerState: server.ChangeProducerStateDto
  ) {
    const { roomId, producerId, status } = changeProducerState;
    this.mediasoupService.changeProducerStatus(client.id, changeProducerState);

    if (status === STREAM_STATUS.pause) {
      client.to(roomId).emit(SOCKET_EVENTS.producerPaused, { producerId });
    } else {
      client.to(roomId).emit(SOCKET_EVENTS.producerResumed, { producerId });
    }

    return { producerId };
  }

  @SubscribeMessage(SOCKET_EVENTS.consumerStatusChange)
  pauseConsumer(
    @ConnectedSocket() client: Socket,
    @MessageBody() changeConsumerState: server.ChangeConsumerStateDto
  ) {
    const { consumerId } = changeConsumerState;
    this.mediasoupService.changeConsumerStatus(client.id, changeConsumerState);
    return consumerId;
  }
}
