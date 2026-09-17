import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Columns3, LayoutDashboard, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/advisor")({
  component: AdvisorLayout,
});

function AdvisorLayout() {
  return (
    <AppShell
      eyebrow="Advisor workspace"
      items={[
        { to: "/advisor", label: "Today", icon: LayoutDashboard },
        { to: "/advisor/caseload", label: "Caseload", icon: Users },
        { to: "/advisor/workflow", label: "Workflow", icon: Columns3 },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
