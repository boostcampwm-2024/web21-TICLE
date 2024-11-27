import { Outlet, ScrollRestoration, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="h-full min-h-dvh bg-weak">
      <ScrollRestoration />
      <Outlet />
    </div>
  );
}
