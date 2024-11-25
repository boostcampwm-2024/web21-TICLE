import { createFileRoute } from '@tanstack/react-router';

import Header from '@/components/Header';
import TicleList from '@/components/ticle/list';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  return (
    <>
      <Header />
      <TicleList />
    </>
  );
}
