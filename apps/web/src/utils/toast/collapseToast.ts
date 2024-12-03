import { TOAST_COLLAPSE_DURATION } from '@/constants/toast';

export const collapseToast = (
  node: HTMLElement,
  done: () => void,
  duration = TOAST_COLLAPSE_DURATION
) => {
  const { scrollHeight, style } = node;

  requestAnimationFrame(() => {
    style.minHeight = 'initial';
    style.height = `${scrollHeight}px`;
    style.transition = `all ${duration}ms`;

    requestAnimationFrame(() => {
      style.height = '0';
      style.padding = '0';
      style.margin = '0';
      setTimeout(done, duration as number);
    });
  });
};
