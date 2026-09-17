import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { INTEGRATIONS } from "@/lib/meridian/seed";

export const Route = createFileRoute("/ops/integrations")({
  component: IntegrationsPage,
});

function tone(status: (typeof INTEGRATIONS)[number]["status"]) {
  if (status === "connected") return "good" as const;
  if (status === "migrating") return "warn" as const;
  return "accent" as const;
}

function IntegrationsPage() {
  return (
    <div>
      <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
        Integrations
      </h1>
      <p className="mt-2 max-w-xl text-muted">
        External platforms the FES operating model depends on — government,
        vacancies, engagement, employers, and the iWorks cutover.
      </p>
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {INTEGRATIONS.map((item) => (
          <li key={item.id}>
            <Card>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium tracking-wide text-subtle uppercase">
                    {item.category}
                  </p>
                  <h2 className="mt-1 font-display text-xl">{item.name}</h2>
                </div>
                <Badge tone={tone(item.status)}>{item.status}</Badge>
              </div>
              <p className="mt-3 text-sm text-muted">{item.detail}</p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
