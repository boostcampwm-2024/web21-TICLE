export const MEDIA_TYPES = {
  audio: 'audio',
  video: 'video',
  screen: 'screen',
} as const;

export type MediaTypes = (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES];
