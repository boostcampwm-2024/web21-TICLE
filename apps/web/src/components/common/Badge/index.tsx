import { HTMLAttributes, ReactNode } from 'react';

import cn from '@/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function Badge({ children, className, ...rest }: BadgeProps) {
  return (
    <div
      className={cn(
        'w-fit rounded-md border border-primary bg-secondary px-2 py-1.5 text-label1 text-primary',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Badge;
