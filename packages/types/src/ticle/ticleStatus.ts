export const TicleStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  CLOSED: 'closed',
} as const;

export type TicleStatus = (typeof TicleStatus)[keyof typeof TicleStatus];
