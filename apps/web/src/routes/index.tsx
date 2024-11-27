import { createFileRoute } from '@tanstack/react-router';

import Header from '@/components/common/Header';
import TicleList from '@/components/ticle/list';
import Banner from '@/components/ticle/list/Banner';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  return (
    <>
      <Header />
      <Banner />
      <TicleList />
    </>
  );
}
