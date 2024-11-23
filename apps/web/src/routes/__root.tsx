import { Outlet, ScrollRestoration, createRootRoute, useLocation } from '@tanstack/react-router';

import Header from '@/components/Header';

const NO_HEADER_PATHS = ['/live', '/auth'];

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const currentPath = location.pathname;
  const hasHeader = !NO_HEADER_PATHS.some((path) => currentPath.startsWith(path));

  return (
    <div className="h-full min-h-dvh bg-weak">
      <ScrollRestoration />
      {hasHeader && <Header />}
      <Outlet />
    </div>
  );
}
