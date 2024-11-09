import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  return (
    <>
      <Link to="/ticle/open">티클 개설하기</Link>
      <div className="flex m-5 gap-2">
        <Link to="/ticle/$ticleId" params={{ ticleId: '1' }} className="p-4 border border-main">
          Ticle 1
        </Link>
        <Link to="/ticle/$ticleId" params={{ ticleId: '2' }} className="p-4 border border-main">
          Ticle 2
        </Link>
        <Link to="/ticle/$ticleId" params={{ ticleId: '3' }} className="p-4 border border-main">
          Ticle 3
        </Link>
      </div>
    </>
  );
}
