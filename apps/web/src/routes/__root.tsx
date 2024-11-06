import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router';

import Header from '@/components/common/Header';

const NO_HEADER_PATHS = ['/live', '/auth/oauth', '/auth/login'];

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const currentPath = location.pathname;
  const hasHeader = !NO_HEADER_PATHS.includes(currentPath);

  return (
    <>
      {hasHeader && <Header />}
      <Outlet />
    </>
  );
}
