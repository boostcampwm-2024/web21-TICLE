export const STREAM_STATUS = {
  pause: 'pause',
  resume: 'resume',
} as const;

export type StreamStatus = (typeof STREAM_STATUS)[keyof typeof STREAM_STATUS];

export const MEDIA_TYPES = {
  audio: 'audio',
  video: 'video',
  screen: 'screen',
} as const;

export type MediaTypes = (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES];
