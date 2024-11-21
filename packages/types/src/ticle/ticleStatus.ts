export const TicleStatus = {
  OPEN: 'open',
  CLOSED: 'closed',
} as const;

export type TicleStatus = (typeof TicleStatus)[keyof typeof TicleStatus];
