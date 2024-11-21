import { createRouter, RouterProvider } from '@tanstack/react-router';

import AppQueryProvider from '@/components/AppQueryProvider';

import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <AppQueryProvider>
      <RouterProvider router={router} />
    </AppQueryProvider>
  );
}

export default App;
