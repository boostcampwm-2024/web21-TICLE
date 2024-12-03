import { ReactNode, RefObject, useEffect, useLayoutEffect, useRef } from 'react';

import { ENTER_CLASSNAME, EXIT_CLASSNAME, TOAST_COLLAPSE_DURATION } from '@/constants/toast';
import { collapseToast } from '@/utils/toast/collapseToast';

type AnimationStep = 'enter' | 'exit';

export interface ToastTransitionProps {
  isIn: boolean;
  done: () => void;
  nodeRef: RefObject<HTMLElement>;
  children?: ReactNode;
  collapseDuration?: number;
}

const ToastTransition = ({
  isIn,
  done,
  nodeRef,
  children,
  collapseDuration = TOAST_COLLAPSE_DURATION,
}: ToastTransitionProps) => {
  const animationStep = useRef<AnimationStep>('enter');

  useLayoutEffect(() => {
    const node = nodeRef.current;

    if (!node) return;

    const onEntered = (e: AnimationEvent) => {
      if (e.target !== nodeRef.current) return;

      node.removeEventListener('animationend', onEntered);
      node.removeEventListener('animationcancel', onEntered);

      if (animationStep.current !== 'enter' || e.type === 'animationcancel') return;

      node.classList.remove(ENTER_CLASSNAME);
    };

    const onEnter = () => {
      node.classList.add(ENTER_CLASSNAME);
      node.addEventListener('animationend', onEntered);
      node.addEventListener('animationcancel', onEntered);
    };

    onEnter();
  }, [nodeRef]);

  useEffect(() => {
    const node = nodeRef.current;

    if (isIn || !node) return;

    const onExited = () => {
      node.removeEventListener('animationend', onExited);
      collapseToast(node, done, collapseDuration);
    };

    const onExit = () => {
      animationStep.current = 'exit';
      node.classList.add(EXIT_CLASSNAME);
      node.addEventListener('animationend', onExited);
    };

    onExit();
  }, [isIn]);

  return <>{children}</>;
};

export default ToastTransition;
