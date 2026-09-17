import { createFileRoute, Link } from "@tanstack/react-router";
import { RiskBadge } from "@/components/status";
import { Card } from "@/components/ui/card";
import { displayName, useMeridian } from "@/lib/meridian/store";
import type { WorkflowTask } from "@/lib/meridian/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/advisor/workflow")({
  component: WorkflowPage,
});

const COLUMNS: { id: WorkflowTask["column"]; label: string; hint: string }[] = [
  { id: "referrals", label: "Referrals", hint: "Onboarding" },
  { id: "contact", label: "Contact due", hint: "Cadence" },
  { id: "assessments", label: "Assessments", hint: "Four pillars" },
  { id: "interventions", label: "Interventions", hint: "Delivery" },
  { id: "outcomes", label: "Outcomes", hint: "Evidence" },
];

function WorkflowPage() {
  const workflow = useMeridian((s) => s.workflow);
  const participants = useMeridian((s) => s.participants);
  const moveTask = useMeridian((s) => s.moveTask);
  const advisorId = useMeridian((s) => s.advisorId);

  return (
    <div>
      <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">Workflow</h1>
      <p className="mt-2 max-w-xl text-muted">
        Orchestrate the work, not just the case record. Move cards as contact is made and
        evidence lands.
      </p>

      <div className="mt-6 flex gap-3 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const cards = workflow.filter((t) => t.column === col.id);
          return (
            <section
              key={col.id}
              className="w-[17.5rem] shrink-0 rounded-2xl bg-sage/70 p-3"
              aria-label={col.label}
            >
              <div className="flex items-baseline justify-between px-1 pb-2">
                <h2 className="text-sm font-medium">{col.label}</h2>
                <span className="text-xs tabular-nums text-subtle">{cards.length}</span>
              </div>
              <p className="px-1 pb-3 text-xs text-subtle">{col.hint}</p>
              <ul className="flex flex-col gap-2">
                {cards.map((task) => {
                  const p = participants.find((x) => x.id === task.participantId);
                  if (!p) return null;
                  const mine = p.advisorId === advisorId;
                  return (
                    <li key={task.id}>
                      <Card className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to="/advisor/participants/$participantId"
                            params={{ participantId: p.id }}
                            className="font-medium hover:text-accent"
                          >
                            {displayName(p)}
                          </Link>
                          <RiskBadge risk={p.risk} />
                        </div>
                        <p className="mt-1 text-sm text-muted">{task.title}</p>
                        <p className="mt-2 text-xs text-subtle">
                          Due {task.due}
                          {mine ? " · yours" : ""}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {COLUMNS.filter((c) => c.id !== col.id).map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => moveTask(task.id, c.id)}
                              className={cn(
                                "rounded-full bg-sage px-2 py-1 text-[11px] text-muted hover:text-ink",
                              )}
                            >
                              {c.label}
                            </button>
                          ))}
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
