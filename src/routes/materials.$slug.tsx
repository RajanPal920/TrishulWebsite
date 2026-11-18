import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/materials/$slug")({
  component: MaterialLayout,
});

function MaterialLayout() {
  return <Outlet />;
}
