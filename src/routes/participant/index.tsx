import { createFileRoute, Link } from "@tanstack/react-router";
import { JourneyRail } from "@/components/journey-rail";
import { StageBadge } from "@/components/status";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { advisorById, displayName, useMeridian } from "@/lib/meridian/store";
import { PILLARS } from "@/lib/meridian/types";
import { formatDate } from "@/lib/meridian/format";

export const Route = createFileRoute("/participant/")({
  component: ParticipantHome,
});

function ParticipantHome() {
  const selfId = useMeridian((s) => s.selfId);
  const participants = useMeridian((s) => s.participants);
  const p = participants.find((x) => x.id === selfId);
  const toggleAction = useMeridian((s) => s.toggleAction);

  if (!p) return null;
  const advisor = advisorById(p.advisorId);
  const next = p.actions.filter((a) => !a.done);

  return (
    <div>
      <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
        Hello, {p.preferredName}.
      </h1>
      <p className="mt-2 max-w-xl text-muted">
        You and {advisor?.name} are working towards {p.goal.toLowerCase()}. Take the
        next small step — nothing here is a test.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <StageBadge stage={p.stage} />
        <span className="text-sm text-muted">{p.daysOnProgramme} days on programme</span>
      </div>

      <div className="mt-5 rounded-2xl bg-surface px-4 py-5 shadow-[var(--shadow-border)]">
        <p className="mb-3 text-xs font-medium tracking-wide text-subtle uppercase">
          Your journey
        </p>
        <JourneyRail current={p.stage} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl">Next with {advisor?.name.split(" ")[0]}</h2>
          <p className="mt-1 text-sm text-muted">{p.nextAction}</p>
          <ul className="mt-4 space-y-1">
            {next.length === 0 ? (
              <li className="text-sm text-muted">You are up to date. Well done.</li>
            ) : (
              next.map((a) => (
                <li key={a.id}>
                  <label className="flex min-h-11 items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1 size-4 accent-[var(--color-accent)]"
                      checked={a.done}
                      onChange={() => toggleAction(p.id, a.id)}
                    />
                    <span>
                      {a.title}
                      <span className="mt-0.5 block text-xs text-subtle">
                        Due {formatDate(a.due)}
                      </span>
                    </span>
                  </label>
                </li>
              ))
            )}
          </ul>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/participant/plan">Open full plan</Link>
          </Button>
        </Card>

        <Card>
          <h2 className="font-display text-xl">How you are scoring yourself</h2>
          <p className="mt-1 text-sm text-muted">
            Four pillars. Move the scores on your plan whenever they change.
          </p>
          <div className="mt-4 space-y-4">
            {PILLARS.map((pillar) => (
              <div key={pillar.key}>
                <div className="flex justify-between text-sm">
                  <span>{pillar.label}</span>
                  <span className="tabular-nums text-muted">{p.assessment[pillar.key]}</span>
                </div>
                <Progress className="mt-1.5" value={p.assessment[pillar.key]} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="font-display text-xl">Jobs that fit your hours</h2>
            <p className="mt-1 text-sm text-muted">
              Matched to {p.availability.toLowerCase()} and your goal.
            </p>
          </div>
          <Button asChild className="mt-5 self-start">
            <Link to="/participant/jobs">See matches</Link>
          </Button>
        </Card>
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="font-display text-xl">Practise an interview</h2>
            <p className="mt-1 text-sm text-muted">
              A quiet rehearsal. Feedback on what you said, then the next question.
            </p>
          </div>
          <Button asChild variant="outline" className="mt-5 self-start">
            <Link to="/participant/coach">Start practice</Link>
          </Button>
        </Card>
      </div>
      <p className="sr-only">Signed in as {displayName(p)}</p>
    </div>
  );
}
