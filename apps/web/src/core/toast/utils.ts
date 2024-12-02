import { ToastContent, ToastOptions, ToastId, NotValidatedToastProps } from '@/core/toast/type';

import { eventManager } from './eventManager';

let TOAST_ID = 1;

const generateToastId = () => {
  return TOAST_ID++;
};

const dispatchToast = (content: ToastContent, options: NotValidatedToastProps): ToastId => {
  eventManager.emit('show', content, options);

  return options.toastId;
};

const mergeOptions = (options?: ToastOptions): NotValidatedToastProps => {
  return {
    ...options,
    toastId: generateToastId(),
  };
};

const toast = (content: ToastContent, options?: ToastOptions) => {
  return dispatchToast(content, mergeOptions(options));
};

export { toast };
