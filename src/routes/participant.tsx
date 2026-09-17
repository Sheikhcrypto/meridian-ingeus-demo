import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Briefcase, ClipboardCheck, House, Mic } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/participant")({
  component: ParticipantLayout,
});

function ParticipantLayout() {
  return (
    <AppShell
      eyebrow="Your journey"
      items={[
        { to: "/participant", label: "Home", icon: House },
        { to: "/participant/plan", label: "Plan", icon: ClipboardCheck },
        { to: "/participant/jobs", label: "Jobs", icon: Briefcase },
        { to: "/participant/coach", label: "Interview", icon: Mic },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
