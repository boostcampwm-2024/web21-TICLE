import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/live/$ticleId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { ticleId } = Route.useParams();
  return `live ${ticleId}`;
}
