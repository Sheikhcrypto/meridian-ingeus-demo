import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/meridian/format";
import { useMeridian } from "@/lib/meridian/store";
import { PILLARS, type Assessment } from "@/lib/meridian/types";

export const Route = createFileRoute("/participant/plan")({
  component: PlanPage,
});

function PlanPage() {
  const selfId = useMeridian((s) => s.selfId);
  const participants = useMeridian((s) => s.participants);
  const p = participants.find((x) => x.id === selfId);
  const setAssessment = useMeridian((s) => s.setAssessment);
  const toggleAction = useMeridian((s) => s.toggleAction);

  if (!p) return null;
  const person = p;

  function update(key: keyof Assessment, value: number) {
    setAssessment(person.id, { ...person.assessment, [key]: value });
  }

  return (
    <div>
      <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
        Your plan
      </h1>
      <p className="mt-2 max-w-xl text-muted">
        This is the agreement between you and your advisor. Update how you feel
        on each pillar — it helps them support you properly.
      </p>

      <Card className="mt-6">
        <h2 className="font-display text-xl">What you are working towards</h2>
        <p className="mt-2 text-base">{p.goal}</p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">
          {p.plan || "Your advisor will write this with you after assessment."}
        </p>
      </Card>

      <Card className="mt-4">
        <h2 className="font-display text-xl">My Life, Skills, Work, Aspirations</h2>
        <div className="mt-5 space-y-6">
          {PILLARS.map((pillar) => (
            <div key={pillar.key}>
              <div className="flex items-baseline justify-between gap-3">
                <Label htmlFor={pillar.key}>{pillar.label}</Label>
                <span className="text-sm tabular-nums text-muted">
                  {p.assessment[pillar.key]}
                </span>
              </div>
              <p className="mt-1 text-sm text-subtle">{pillar.prompt}</p>
              <input
                id={pillar.key}
                type="range"
                min={0}
                max={100}
                value={p.assessment[pillar.key]}
                onChange={(e) => update(pillar.key, Number(e.target.value))}
                className="mt-3 h-11 w-full accent-[var(--color-accent)]"
              />
              <Progress className="mt-2" value={p.assessment[pillar.key]} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-4">
        <h2 className="font-display text-xl">Actions</h2>
        <ul className="mt-3 space-y-1">
          {p.actions.map((a) => (
            <li key={a.id}>
              <label className="flex min-h-11 items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-[var(--color-accent)]"
                  checked={a.done}
                  onChange={() => toggleAction(p.id, a.id)}
                />
                <span className={a.done ? "text-muted line-through" : ""}>
                  {a.title}
                  <span className="mt-0.5 block text-xs text-subtle">
                    {a.owner === "advisor" ? "Your advisor" : "You"} · {formatDate(a.due)}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
