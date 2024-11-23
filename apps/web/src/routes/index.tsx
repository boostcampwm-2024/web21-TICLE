import { createFileRoute, Link } from '@tanstack/react-router';

import TicleList from '@/components/ticle/list/TicleList';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  return (
    <>
      <TicleList />
    </>
  );
}
