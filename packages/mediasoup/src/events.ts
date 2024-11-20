export const SOCKET_EVENTS = {
  // Socket.IO 기본 연결 이벤트
  connect: 'connect',
  disconnect: 'disconnect',
  error: 'error',
  reconnect: 'reconnect',
  reconnectAttempt: 'reconnect_attempt',
  reconnectFailed: 'reconnect_failed',

  // MediaSoup 관련 이벤트
  newPeer: 'new-peer',
  newProducer: 'new-producer',
  peerLeft: 'peer-left',
  consumerClosed: 'consumer-closed',
  consumerPaused: 'consumer-paused',
  closeProducer: 'close-producer',
  producerPaused: 'producer-paused',
  producerClosed: 'producer-closed',
  createRoom: 'create-room',
  joinRoom: 'join-room',
  createTransport: 'create-transport',
  connectTransport: 'connect-transport',
  produce: 'produce',
  getProducer: 'get-producer',
  consume: 'consume',
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
