export const Provider = {
  github: 'github',
  google: 'google',
  guest: 'guest',
} as const;

export type Provider = (typeof Provider)[keyof typeof Provider];
