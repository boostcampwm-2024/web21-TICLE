import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  return (
    <>
      <Link to="/ticle/open">티클 개설하기</Link>
      <div className="m-5 flex gap-2">
        <Link to="/ticle/$ticleId" params={{ ticleId: '1' }} className="border border-main p-4">
          Ticle 1
        </Link>
        <Link to="/ticle/$ticleId" params={{ ticleId: '2' }} className="border border-main p-4">
          Ticle 2
        </Link>
        <Link to="/ticle/$ticleId" params={{ ticleId: '3' }} className="border border-main p-4">
          Ticle 3
        </Link>
      </div>
    </>
  );
}
