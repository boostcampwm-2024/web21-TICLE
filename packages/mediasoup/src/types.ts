export const PRODUCER_STATUS = {
  pause: 'pause',
  resume: 'resume',
} as const;

export type ProducerStatus = (typeof PRODUCER_STATUS)[keyof typeof PRODUCER_STATUS];

export const MEDIA_TYPES = {
  audio: 'audio',
  video: 'video',
  screen: 'screen',
} as const;

export type MediaTypes = (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES];
