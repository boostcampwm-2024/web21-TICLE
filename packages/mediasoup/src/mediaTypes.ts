const MEDIA_TYPES = {
    Audio: "audio",
    Video: "video",
    Screen: 'screen'
  } as const;
  
export type MediaTypes = (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES];

