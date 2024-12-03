import { cva } from 'class-variance-authority';
import { ReactNode, useEffect } from 'react';

import ToastTransition from '@/components/toast/ToastTransition';
import { ToastProps } from '@/core/toast/type';
import useToast from '@/hooks/toast/useToast';

const containerVariants = cva(
  'z-0 mb-4 flex max-h-[800px] min-h-16 cursor-pointer justify-between overflow-hidden rounded-md bg-[#000000b3] text-white shadow-md [&.bounce-enter]:animate-bounce-in-bottom [&.bounce-exit]:animate-bounce-out-bottom',
  {
    variants: {
      closeOnClick: {
        true: 'pointer',
        false: 'default',
      },
    },
  }
);
const Toast = (props: ToastProps) => {
  const { toastRef, eventHandlers } = useToast(props);
  const { autoClose, children, closeToast, deleteToast, toastId, isIn, closeOnClick } = props;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isIn) return;

      closeToast();
    }, autoClose);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <ToastTransition isIn={isIn} done={deleteToast} nodeRef={toastRef}>
      <div
        ref={toastRef}
        id={String(toastId)}
        className={containerVariants({ closeOnClick })}
        {...eventHandlers}
      >
        <div className="mx-0 my-auto flex flex-1 items-center justify-center px-3 py-2 text-sm">
          <div className="flex items-center justify-center gap-2">{children as ReactNode}</div>
        </div>
      </div>
    </ToastTransition>
  );
};

export default Toast;
