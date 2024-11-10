import { ReactNode } from '@tanstack/react-router';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  portalId: string;
  className: string;
  children: ReactNode;
}

function Portal({ portalId, className, children }: PortalProps) {
  useEffect(() => {
    let portalRoot = document.getElementById(portalId);

    if (!portalId) {
      portalRoot = document.createElement('div');
      portalRoot.setAttribute('id', portalId);
      if (className) {
        portalRoot.className = className;
      }
      document.body.appendChild(portalRoot);
    }

    return () => {
      if (portalRoot && !portalRoot.childNodes.length) {
        portalRoot.remove();
      }
    };
  }, [portalId, className]);

  const portalRoot = document.getElementById(portalId);
  if (!portalRoot) return null;

  return createPortal(children, portalRoot);
}

export default Portal;
