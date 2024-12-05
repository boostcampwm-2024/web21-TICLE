import { Outlet, ScrollRestoration, createRootRoute } from '@tanstack/react-router';

import NotFound from '@/components/NotFound';
import NotSupportedMobile from '@/components/NotSupportedMobile';
import { ToastContainer } from '@/components/toast/ToastContainer';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    return <NotSupportedMobile />;
  }

  return (
    <div className="h-full min-h-dvh bg-weak">
      <ScrollRestoration />
      <Outlet />
      <ToastContainer />
    </div>
  );
}
