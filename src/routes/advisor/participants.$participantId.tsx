import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { JourneyRail } from "@/components/journey-rail";
import { RiskBadge, StageBadge } from "@/components/status";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/input";
import { formatDate, participantBrief } from "@/lib/meridian/format";
import { advisorById, displayName, useMeridian } from "@/lib/meridian/store";
import { PILLARS } from "@/lib/meridian/types";
import { useAi } from "@/lib/meridian/use-ai";

export const Route = createFileRoute("/advisor/participants/$participantId")({
  component: ParticipantFile,
});

function ParticipantFile() {
  const { participantId } = Route.useParams();
  const participants = useMeridian((s) => s.participants);
  const allInterventions = useMeridian((s) => s.interventions);
  const participant = participants.find((p) => p.id === participantId);
  const interventions = allInterventions.filter((i) => i.participantId === participantId);
  const addNote = useMeridian((s) => s.addNote);
  const setPlan = useMeridian((s) => s.setPlan);
  const toggleAction = useMeridian((s) => s.toggleAction);
  const [bullets, setBullets] = useState("");
  const notesAi = useAi();
  const planAi = useAi();

  if (!participant) {
    return (
      <div className="mt-8">
        <h1 className="font-display text-3xl">Person not found</h1>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/advisor/caseload">Back to caseload</Link>
        </Button>
      </div>
    );
  }

  const p = participant;
  const advisor = advisorById(p.advisorId);

  async function draftNotes() {
    const res = await notesAi.run(
      "session-notes",
      `${participantBrief(p)}\n\nAdvisor bullets:\n${bullets || "(no bullets — infer from latest notes and next action)"}`,
    );
    if (!res.ok) toast.error(res.error);
  }

  async function draftPlan() {
    const res = await planAi.run("support-plan", participantBrief(p));
    if (!res.ok) toast.error(res.error);
  }

  return (
    <div>
      <Link
        to="/advisor/caseload"
        className="text-sm text-muted hover:text-ink"
      >
        Caseload
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl leading-tight sm:text-4xl">
            {displayName(p)}
          </h1>
          <p className="mt-1 text-muted">
            {p.age ? `${p.age} · ` : ""}
            {p.pronouns ? `${p.pronouns} · ` : ""}
            {p.centre} · {advisor?.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <StageBadge stage={p.stage} />
          <RiskBadge risk={p.risk} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-surface px-4 py-5 shadow-[var(--shadow-border)]">
        <JourneyRail current={p.stage} />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Goal", p.goal],
          ["Availability", p.availability],
          ["Programme", p.programme],
          ["Referral", `${p.referralSource} · ${formatDate(p.referralDate)}`],
        ].map(([k, v]) => (
          <Card key={k} className="p-4">
            <dt className="text-xs font-medium tracking-wide text-subtle uppercase">{k}</dt>
            <dd className="mt-1 text-sm">{v}</dd>
          </Card>
        ))}
      </dl>

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="ai">AI assist</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5 grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="font-display text-xl">Barriers</h2>
            {p.barriers.length === 0 ? (
              <p className="mt-2 text-sm text-muted">None recorded yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {p.barriers.map((b) => (
                  <li key={b.id} className="flex items-start justify-between gap-3 text-sm">
                    <span>{b.label}</span>
                    <span className="shrink-0 text-xs text-subtle">{b.kind}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <h2 className="font-display text-xl">Action plan</h2>
            <ul className="mt-3 space-y-2">
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
                        {a.owner} · due {formatDate(a.due)}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            {p.outcome && (
              <div className="mt-4 rounded-xl bg-good-soft p-3 text-sm">
                <p className="font-medium text-good">
                  {p.outcome.role} · {p.outcome.employer}
                </p>
                <p className="mt-1 text-muted">
                  Started {formatDate(p.outcome.startDate)} · week{" "}
                  {p.outcome.sustainmentWeek} · {p.outcome.hours} hrs · {p.outcome.wage}
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="assessment" className="mt-5">
          <Card>
            <h2 className="font-display text-xl">Four pillars</h2>
            <p className="mt-1 text-sm text-muted">
              Shared with the participant. Scores are a conversation, not a ranking.
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {PILLARS.map((pillar) => (
                <div key={pillar.key}>
                  <div className="flex items-baseline justify-between">
                    <p className="font-medium">{pillar.label}</p>
                    <p className="text-sm tabular-nums text-muted">
                      {p.assessment[pillar.key]}
                    </p>
                  </div>
                  <Progress className="mt-2" value={p.assessment[pillar.key]} />
                  <p className="mt-2 text-sm text-subtle">{pillar.prompt}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="interventions" className="mt-5">
          <Card>
            <h2 className="font-display text-xl">Intervention delivery</h2>
            {interventions.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No interventions scheduled.</p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {interventions.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                    <div>
                      <p className="font-medium">{i.title}</p>
                      <p className="text-sm text-muted">
                        {i.kind} · {i.owner}
                        {i.notes ? ` · ${i.notes}` : ""}
                      </p>
                    </div>
                    <p className="text-sm text-subtle">
                      {i.status.replace("-", " ")} · {formatDate(i.scheduled)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-5">
          <Card>
            <h2 className="font-display text-xl">Case notes</h2>
            <ul className="mt-4 space-y-4">
              {p.notes.map((note) => (
                <li key={note.id} className="border-l-2 border-line pl-3">
                  <p className="text-xs text-subtle">
                    {formatDate(note.at)} · {note.author}
                    {note.source === "ai" ? " · AI draft accepted" : ""}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">{note.body}</p>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-5 grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="font-display text-xl">Draft session notes</h2>
            <p className="mt-1 text-sm text-muted">
              Paste rough bullets. Meridian writes a case note you can accept.
            </p>
            <Textarea
              className="mt-3"
              value={bullets}
              onChange={(e) => setBullets(e.target.value)}
              placeholder="Discussed childcare, agreed two applications, nerves about interviews…"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => void draftNotes()} disabled={notesAi.loading}>
                <Sparkles className="size-4" />
                {notesAi.loading ? "Drafting" : "Draft notes"}
              </Button>
              {notesAi.text && (
                <Button
                  variant="outline"
                  onClick={() => {
                    addNote(p.id, notesAi.text, "ai");
                    toast.success("Note saved");
                    notesAi.setText("");
                  }}
                >
                  Accept onto file
                </Button>
              )}
            </div>
            {notesAi.error && <p className="mt-3 text-sm text-bad">{notesAi.error}</p>}
            {notesAi.text && (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{notesAi.text}</p>
            )}
          </Card>
          <Card>
            <h2 className="font-display text-xl">Personalised support plan</h2>
            <p className="mt-1 text-sm text-muted">
              Four-week plan from the file. You remain the author of record.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Current: {p.plan || "No plan stored yet."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => void draftPlan()} disabled={planAi.loading}>
                <Sparkles className="size-4" />
                {planAi.loading ? "Drafting" : "Generate plan"}
              </Button>
              {planAi.text && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setPlan(p.id, planAi.text);
                    toast.success("Plan updated");
                  }}
                >
                  Accept plan
                </Button>
              )}
            </div>
            {planAi.error && <p className="mt-3 text-sm text-bad">{planAi.error}</p>}
            {planAi.text && (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{planAi.text}</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
