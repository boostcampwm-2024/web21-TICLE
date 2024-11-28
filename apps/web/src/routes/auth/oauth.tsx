import { createFileRoute } from '@tanstack/react-router';

import Auth from '@/components/auth';

interface SearchParams {
  redirect: string | undefined;
}

export const Route = createFileRoute('/auth/oauth')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    };
  },

  component: RouteComponent,
});

function RouteComponent() {
  return <Auth />;
}
