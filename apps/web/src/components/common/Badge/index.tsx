import { HTMLAttributes, ReactNode } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function Badge({ children }: BadgeProps) {
  return (
    <div className="rounded-md border border-primary bg-secondary px-2 py-1.5 text-label1 text-primary">
      {children}
    </div>
  );
}

export default Badge;
