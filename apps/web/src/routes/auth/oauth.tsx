import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/oauth')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex">
      OAuth 로그인
      <Link to="/auth/login" className="border border-main p-5">
        로컬 로그인
      </Link>
    </div>
  );
}
