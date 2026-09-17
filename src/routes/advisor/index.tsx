import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { JourneyRail } from "@/components/journey-rail";
import { RiskBadge, StageBadge } from "@/components/status";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import { ADVISORS } from "@/lib/meridian/seed";
import { daysSince, participantBrief } from "@/lib/meridian/format";
import { displayName as nameOf, useMeridian } from "@/lib/meridian/store";
import { useAi } from "@/lib/meridian/use-ai";

export const Route = createFileRoute("/advisor/")({
  component: AdvisorHome,
});

function AdvisorHome() {
  const advisorId = useMeridian((s) => s.advisorId);
  const setAdvisorId = useMeridian((s) => s.setAdvisorId);
  const participants = useMeridian((s) => s.participants);
  const acceptReferral = useMeridian((s) => s.acceptReferral);
  const mine = participants.filter((p) => p.advisorId === advisorId);
  const advisor = ADVISORS.find((a) => a.id === advisorId);
  const overdue = mine.filter((p) => daysSince(p.lastContact) >= 14);
  const atRisk = mine.filter((p) => p.risk === "high");
  const starts = mine.filter((p) => p.outcome);
  const ai = useAi();
  const [referOpen, setReferOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    centre: advisor?.centre ?? "Manchester",
    goal: "",
    source: "Jobcentre Plus",
  });

  const queue = useMemo(
    () =>
      [...mine]
        .sort((a, b) => {
          const rank = (r: string) => (r === "high" ? 0 : r === "medium" ? 1 : 2);
          const risk = rank(a.risk) - rank(b.risk);
          if (risk) return risk;
          return daysSince(b.lastContact) - daysSince(a.lastContact);
        })
        .slice(0, 5),
    [mine],
  );

  async function brief() {
    const res = await ai.run(
      "caseload-brief",
      `Advisor: ${advisor?.name} (${advisor?.centre}). Caseload:\n${mine
        .map(participantBrief)
        .join("\n---\n")}`,
    );
    if (!res.ok) toast.error(res.error);
  }

  return (
    <div>
      <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-3xl leading-tight sm:text-4xl">
            Good morning, {advisor?.name.split(" ")[0]}.
          </h1>
          <p className="mt-2 max-w-xl text-muted">
            {mine.length} people on your caseload at {advisor?.centre}. AI drafts
            the briefing; you decide what happens next.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <label className="sr-only" htmlFor="advisor-switch">
            Switch advisor
          </label>
          <select
            id="advisor-switch"
            className="h-11 min-h-11 flex-1 rounded-lg border border-line bg-surface px-3 text-sm lg:w-56 lg:flex-none"
            value={advisorId}
            onChange={(e) => setAdvisorId(e.target.value)}
          >
            {ADVISORS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} · {a.centre}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={() => setReferOpen(true)}>
            Accept referral
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Caseload", value: mine.length, hint: `Target ${advisor?.caseloadTarget}` },
          { label: "Overdue contact", value: overdue.length, hint: "14 days or more" },
          { label: "High risk", value: atRisk.length, hint: "Re-engage first" },
          { label: "In work", value: starts.length, hint: "Sustainment live" },
        ].map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <p className="text-xs font-medium tracking-wide text-subtle uppercase">
              {kpi.label}
            </p>
            <p className="mt-2 font-display text-3xl tabular-nums leading-none">
              {kpi.value}
            </p>
            <p className="mt-2 text-sm text-muted">{kpi.hint}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl">Act today</h2>
              <p className="text-sm text-muted">Highest risk, then longest silence.</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/advisor/caseload">Full caseload</Link>
            </Button>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {queue.map((p) => (
              <li key={p.id} className="py-3 first:pt-0 last:pb-0">
                <Link
                  to="/advisor/participants/$participantId"
                  params={{ participantId: p.id }}
                  className="block rounded-xl px-1 py-1 hover:bg-sage/60"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">{nameOf(p)}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <StageBadge stage={p.stage} />
                      <RiskBadge risk={p.risk} />
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    Last contact {daysSince(p.lastContact)}d ago · {p.nextAction}
                  </p>
                  <div className="mt-3">
                    <JourneyRail current={p.stage} compact />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-display text-xl">AI caseload briefing</h2>
              <p className="text-sm text-muted">Start-of-day narrative. You remain accountable.</p>
            </div>
            <Button onClick={() => void brief()} disabled={ai.loading} size="sm">
              <Sparkles className="size-4" />
              {ai.loading ? "Drafting" : "Draft"}
            </Button>
          </div>
          {ai.error ? (
            <p className="mt-4 text-sm text-bad">{ai.error}</p>
          ) : ai.text ? (
            <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {ai.text}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">
              Meridian will group your people into act now, keep moving, and watch
              — using live caseload risk, contact gaps, and open actions.
            </p>
          )}
        </Card>
      </div>

      <Dialog open={referOpen} onOpenChange={setReferOpen}>
        <DialogContent>
          <DialogTitle>Accept a referral</DialogTitle>
          <DialogDescription>
            Creates a case at referral stage and a first-appointment workflow card.
          </DialogDescription>
          <form
            className="mt-5 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.firstName || !form.lastName) return;
              acceptReferral(form);
              toast.success("Referral accepted");
              setReferOpen(false);
              setForm({
                firstName: "",
                lastName: "",
                centre: advisor?.centre ?? "Manchester",
                goal: "",
                source: "Jobcentre Plus",
              });
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="fn">First name</Label>
                <Input
                  id="fn"
                  className="mt-1"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ln">Last name</Label>
                <Input
                  id="ln"
                  className="mt-1"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="goal">Stated goal</Label>
              <Input
                id="goal"
                className="mt-1"
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                placeholder="e.g. Kitchen work, days only"
              />
            </div>
            <div>
              <Label htmlFor="src">Referral source</Label>
              <Input
                id="src"
                className="mt-1"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              />
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setReferOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Accept onto caseload</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
