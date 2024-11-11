import { ReactNode } from '@tanstack/react-router';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  portalId: string;
  className?: string;
  children?: ReactNode;
}

function Portal({ portalId, className, children }: PortalProps) {
  let element = document.getElementById(portalId);

  if (!element) {
    element = document.createElement('div');
    element.setAttribute('id', portalId);
    if (className) {
      element.className = className;
    }
    document.body.appendChild(element);
  }

  useEffect(() => {
    return () => {
      if (element && !element.childNodes.length) {
        element.remove();
      }
    };
  }, [element]);

  return createPortal(children, element);
}

export default Portal;
