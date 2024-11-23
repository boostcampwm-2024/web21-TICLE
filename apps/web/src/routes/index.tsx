import { createFileRoute } from '@tanstack/react-router';

import TicleList from '@/components/ticle/list';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  return <TicleList />;
}
