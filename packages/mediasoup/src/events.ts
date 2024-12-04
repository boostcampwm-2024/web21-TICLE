export const SOCKET_EVENTS = {
  // Socket.IO 기본 연결 이벤트
  connect: 'connect',
  connectError: 'connect_error',
  disconnect: 'disconnect',
  error: 'error',
  reconnect: 'reconnect',
  reconnectAttempt: 'reconnect_attempt',
  reconnectFailed: 'reconnect_failed',

  // MediaSoup 관련 이벤트
  joinRoom: 'join-room',
  closeRoom: 'close-room',
  createRoom: 'create-room',
  roomClosed: 'room-closed',

  createTransport: 'create-transport',
  connectTransport: 'connect-transport',

  newPeer: 'new-peer',
  peerLeft: 'peer-left',

  produce: 'produce',
  newProducer: 'new-producer',
  getProducers: 'get-producers',
  closeProducer: 'close-producer',
  producerClosed: 'producer-closed',
  producerPaused: 'producer-paused',
  producerResumed: 'producer-resumed',
  producerStatusChange: 'producer-status-change',

  consume: 'consume',
  createConsumers: 'create-consumers',
  consumerClosed: 'consumer-closed',
  consumerPaused: 'consumer-paused',
  pauseConsumers: 'pause-consumers',
  resumeAudioConsumers: 'resume-audio-consumers',
  resumeVideoConsumers: 'resume-video-consumers',
  resumeConsumers: 'resume-consumers',

  changeConsumerPreferredLayers: 'change-consumer-preferred-layers',
} as const;

export const TRANSPORT_EVENTS = {
  connect: 'connect',
  produce: SOCKET_EVENTS.produce,
  consume: SOCKET_EVENTS.consume,
  connectionStateChange: 'connectionstatechange',
  close: 'close',
} as const;

export const PRODUCER_CONSUMER_EVENTS = {
  transportClose: 'transportclose',
  trackEnded: 'trackended',
  close: 'close',
  pause: 'pause',
  resume: 'resume',
  score: 'score',
} as const;

// MediaSoup 연결 상태 타입
export const CONNECTION_STATE = {
  new: 'new',
  connecting: 'connecting',
  connected: 'connected',
  failed: 'failed',
  disconnected: 'disconnected',
  closed: 'closed',
} as const;
