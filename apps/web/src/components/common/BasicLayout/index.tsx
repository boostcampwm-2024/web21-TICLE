import { ReactNode } from '@tanstack/react-router';

interface BasicLayoutProps {
  children?: ReactNode;
}

function BasicLayout({ children }: BasicLayoutProps) {
  return <div className="my-24 flex h-full w-full flex-col items-center">{children}</div>;
}

export default BasicLayout;
