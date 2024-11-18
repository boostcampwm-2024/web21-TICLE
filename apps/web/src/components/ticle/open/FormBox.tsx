import { ReactNode } from '@tanstack/react-router';

import cn from '@/utils/cn';

interface FormBoxProps {
  title?: string;
  children?: ReactNode;
  className?: string;
}

function FormBox({ title, children, className }: FormBoxProps) {
  return (
    <section
      className={cn(
        'flex w-[49.5rem] flex-col gap-9 rounded-lg border border-main bg-white p-10 shadow-normal',
        className
      )}
    >
      {title && <h3 className="text-head3 text-main">{title}</h3>}
      {children}
    </section>
  );
}

export default FormBox;
