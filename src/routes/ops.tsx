import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Cable, LineChart } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/ops")({
  component: OpsLayout,
});

function OpsLayout() {
  return (
    <AppShell
      eyebrow="Programme operations"
      items={[
        { to: "/ops", label: "Performance", icon: LineChart },
        { to: "/ops/integrations", label: "Integrations", icon: Cable },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
