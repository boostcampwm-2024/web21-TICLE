/* eslint-disable react-hooks/exhaustive-deps */
import {
  useEffect,
  useRef,
  useReducer,
  cloneElement,
  isValidElement,
  useState,
  ReactElement,
  ReactNode,
} from 'react';

import { ToastContainerProps } from '@/components/toast/ToastContainer';
import { eventManager } from '@/core/toast/eventManager';
import {
  ToastId,
  ToastProps,
  ToastContent,
  Toast,
  NotValidatedToastProps,
} from '@/core/toast/type';
import { canBeRendered, isStr } from '@/utils/toast/typeGuard';

export interface ContainerInstance {
  count: number;
  toastKey: number;
  props: ToastContainerProps;
  getToast: (id: ToastId) => Toast | null | undefined;
}

const useToastContainer = (props: ToastContainerProps) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [toastIds, setToastIds] = useState<ToastId[]>([]);
  const containerRef = useRef(null);
  const toastToRender = useRef(new Map<ToastId, Toast>()).current;
  const instance = useRef<ContainerInstance>({
    props,
    count: 0,
    toastKey: 1,
    getToast: (id) => toastToRender.get(id),
  }).current;

  useEffect(() => {
    eventManager.on('show', buildToast).on('willUnmount', () => eventManager.off('show'));

    return () => {
      toastToRender.clear();
      eventManager.emit('willUnmount');
    };
  }, []);
  const isToastActive = (id: ToastId) => {
    return toastIds.indexOf(id) !== -1;
  };

  const removeToast = (toastId?: ToastId) => {
    setToastIds((state) => (!toastId ? [] : state.filter((id) => id !== toastId)));
  };

  const buildToast = (content: ToastContent, options: NotValidatedToastProps) => {
    if (!canBeRendered(content) || !containerRef.current) return;

    const { toastId } = options;
    const { props } = instance;

    const closeToast = () => removeToast(toastId);
    const deleteToast = () => {
      toastToRender.delete(toastId);

      instance.count -= 1;

      if (instance.count < 0) instance.count = 0;

      forceUpdate();
    };

    const filteredOptions = Object.fromEntries(
      Object.entries(options).filter(([_, v]) => v != null)
    );

    const toastProps = {
      key: instance.toastKey++,
      ...props,
      ...filteredOptions,
      toastId,
      closeToast,
      deleteToast,
      isIn: false,
    };

    let toastContent = content;

    if (isValidElement(content) && !isStr(content.type)) {
      toastContent = cloneElement(content as ReactElement, { closeToast, toastProps });
    }

    appendToast(toastContent, toastProps);

    instance.count++;
  };

  const appendToast = (content: ToastContent, props: ToastProps) => {
    const { toastId } = props;

    toastToRender.set(toastId, { content, props });

    setToastIds((state) => [toastId, ...state]);
  };

  const getToastToRender = (cb: (toastList: Toast[]) => ReactNode) => {
    const toRender = Array.from(toastToRender.values()).reverse();

    return cb(toRender);
  };

  return {
    getToastToRender,
    containerRef,
    isToastActive,
  };
};

export default useToastContainer;
