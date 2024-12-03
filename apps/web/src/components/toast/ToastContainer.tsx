import Toast from '@/components/toast/Toast';
import { ToastCommonOptions } from '@/core/toast/type';
import useToastContainer from '@/hooks/toast/useToastContainer';

const CONTAINER_CLASS =
  'fixed z-50 min-w-[200px] max-w-[300px] p-1 text-white top-2.5 left-1/2 transform -translate-x-1/2';

export type ToastContainerProps = ToastCommonOptions;

const ToastContainer = ({
  limit = 2,
  autoClose = 2000,
  closeOnClick = true,
}: ToastContainerProps) => {
  const { getToastToRender, containerRef, isToastActive } = useToastContainer({
    limit,
    autoClose,
    closeOnClick,
  });

  return (
    <div ref={containerRef} className={CONTAINER_CLASS}>
      {getToastToRender((toastList) => (
        <>
          {toastList.map(({ content, props }) => (
            <Toast {...props} key={`toast-${props.key}`} isIn={isToastActive(props.toastId)}>
              {content}
            </Toast>
          ))}
        </>
      ))}
    </div>
  );
};

export { ToastContainer };
