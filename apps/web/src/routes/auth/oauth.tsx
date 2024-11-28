import { createFileRoute } from '@tanstack/react-router';

import Auth from '@/components/auth';

export const Route = createFileRoute('/auth/oauth')({
  validateSearch: (
    search: Record<string, unknown>
  ): {
    redirect?: string;
  } => {
    return {
      redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    };
  },

  component: RouteComponent,
});

function RouteComponent() {
  return <Auth />;
}
