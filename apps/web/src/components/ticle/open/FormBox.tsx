import { ReactNode } from '@tanstack/react-router';

interface FormBoxProps {
  title?: string;
  children?: ReactNode;
}

function FormBox({ title, children }: FormBoxProps) {
  return (
    <section className="flex w-[49.5rem] flex-col gap-9 rounded-lg border border-main bg-white p-10 shadow-normal">
      {title && <h3 className="text-head3 text-main">{title}</h3>}
      {children}
    </section>
  );
}

export default FormBox;
