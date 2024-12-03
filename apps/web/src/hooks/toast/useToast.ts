import { useRef, DOMAttributes } from 'react';

import { ToastProps } from '@/core/toast/type';

const useToast = (props: ToastProps) => {
  const toastRef = useRef<HTMLDivElement>(null);
  const { closeToast, closeOnClick } = props;

  const eventHandlers: DOMAttributes<HTMLElement> = {};

  if (closeOnClick) {
    eventHandlers.onClick = () => {
      closeToast();
    };
  }

  return { toastRef, eventHandlers };
};

export default useToast;
