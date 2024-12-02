import Toast from '@/components/toast/Toast';
import { ToastCommonOptions } from '@/core/toast/type';
import useToastContainer from '@/hooks/toast/useToastContainer';
import cn from '@/utils/cn';

const CONTAINER_CLASS =
  'fixed z-50 min-w-[200px] max-w-[320px] p-1 text-white top-2.5 left-1/2 transform -translate-x-1/2';

export type ToastContainerProps = ToastCommonOptions;

const ToastContainer = ({ autoClose = 2000, closeOnClick = true }: ToastContainerProps) => {
  const { getToastToRender, containerRef, isToastActive } = useToastContainer({
    autoClose,
    closeOnClick,
  });

  return (
    <div ref={containerRef} className={CONTAINER_CLASS}>
      {getToastToRender((toastList) => (
        <div className={cn(CONTAINER_CLASS, 'bottom-0 transition-all delay-300')}>
          {toastList.map(({ content, props: toastProps }) => (
            <Toast
              {...toastProps}
              key={`toast-${toastProps.key}`}
              isIn={isToastActive(toastProps.toastId)}
            >
              {content}
            </Toast>
          ))}
        </div>
      ))}
    </div>
  );
};

export { ToastContainer };
