import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ticle/$ticleId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { ticleId } = Route.useParams();
  return `ticle ${ticleId}`;
}
