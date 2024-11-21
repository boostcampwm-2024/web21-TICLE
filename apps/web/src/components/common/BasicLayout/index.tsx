import { ReactNode } from '@tanstack/react-router';

import cn from '@/utils/cn';

interface BasicLayoutProps {
  children?: ReactNode;
  className?: string;
}

function BasicLayout({ children, className }: BasicLayoutProps) {
  return (
    <div className={cn('my-24 flex h-full w-full flex-col items-center', className)}>
      {children}
    </div>
  );
}

export default BasicLayout;
