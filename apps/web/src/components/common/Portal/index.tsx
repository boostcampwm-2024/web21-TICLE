import { ReactNode } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  portalId: string;
  className?: string;
  children?: ReactNode;
}

function Portal({ portalId, className, children }: PortalProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element = document.getElementById(portalId);

    if (!element) {
      element = document.createElement('div');
      element.setAttribute('id', portalId);
      if (className) {
        element.className = className;
      }
      document.body.appendChild(element);
    }
    setPortalRoot(element);

    return () => {
      if (element && !element.childNodes.length) {
        element.remove();
      }
    };
  }, [portalId, className]);

  if (!portalRoot) return null;

  return createPortal(children, portalRoot);
}

export default Portal;
