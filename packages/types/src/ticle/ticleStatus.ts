export const TicleStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'inProgress',
  CLOSED: 'closed',
} as const;

export type TicleStatus = (typeof TicleStatus)[keyof typeof TicleStatus];
