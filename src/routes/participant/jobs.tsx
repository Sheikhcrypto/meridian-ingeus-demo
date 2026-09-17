import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { rankedJobs } from "@/lib/meridian/match";
import { participantBrief } from "@/lib/meridian/format";
import { JOBS } from "@/lib/meridian/seed";
import { useMeridian } from "@/lib/meridian/store";
import { useAi } from "@/lib/meridian/use-ai";
import type { JobVacancy } from "@/lib/meridian/types";

export const Route = createFileRoute("/participant/jobs")({
  component: JobsPage,
});

function JobsPage() {
  const selfId = useMeridian((s) => s.selfId);
  const participants = useMeridian((s) => s.participants);
  const p = participants.find((x) => x.id === selfId);
  const updateParticipant = useMeridian((s) => s.updateParticipant);
  const setCv = useMeridian((s) => s.setCv);
  const cvAi = useAi();
  const whyAi = useAi();
  const [activeJob, setActiveJob] = useState<JobVacancy | null>(null);

  const ranked = useMemo(() => (p ? rankedJobs(p, JOBS) : []), [p]);

  if (!p) return null;
  const person = p;

  async function rewriteCv() {
    const res = await cvAi.run(
      "cv-rewrite",
      `${participantBrief(person)}\n\nCurrent summary:\n${person.cvSummary || "(empty)"}`,
    );
    if (!res.ok) toast.error(res.error);
  }

  async function why(job: JobVacancy, score: number) {
    setActiveJob(job);
    const res = await whyAi.run(
      "job-why",
      `${participantBrief(person)}\n\nVacancy (match ${score}%):\n${job.title} at ${job.employer}, ${job.location}, ${job.hours}, ${job.salary}. ${job.summary} Skills: ${job.skills.join(", ")}. Inclusive: ${job.inclusive.join(", ")}.`,
    );
    if (!res.ok) toast.error(res.error);
  }

  return (
    <div>
      <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
        Opportunities
      </h1>
      <p className="mt-2 max-w-xl text-muted">
        Ranked for your hours, location and goal — not a firehose of every vacancy
        on the internet.
      </p>

      <Card className="mt-6">
        <h2 className="font-display text-xl">Your professional summary</h2>
        <p className="mt-2 text-sm leading-relaxed">{p.cvSummary || "Not written yet."}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={() => void rewriteCv()} disabled={cvAi.loading} size="sm">
            <Sparkles className="size-4" />
            {cvAi.loading ? "Rewriting" : "Improve with AI"}
          </Button>
          {cvAi.text && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCv(person.id, cvAi.text);
                toast.success("Summary saved");
              }}
            >
              Use this version
            </Button>
          )}
        </div>
        {cvAi.error && <p className="mt-3 text-sm text-bad">{cvAi.error}</p>}
        {cvAi.text && (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{cvAi.text}</p>
        )}
      </Card>

      <ul className="mt-4 grid gap-3">
        {ranked.map(({ job, score }) => (
          <li key={job.id}>
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl leading-snug">{job.title}</h2>
                  <p className="text-sm text-muted">
                    {job.employer} · {job.location}
                  </p>
                </div>
                <p className="text-sm tabular-nums font-medium text-accent">{score}% fit</p>
              </div>
              <p className="mt-3 text-sm">{job.summary}</p>
              <p className="mt-2 text-sm text-muted">
                {job.hours} · {job.salary}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.inclusive.map((tag) => (
                  <Badge key={tag} tone="accent">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    updateParticipant(person.id, { jobsApplied: person.jobsApplied + 1 });
                    toast.success("Marked as applied");
                  }}
                >
                  Mark applied
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={whyAi.loading && activeJob?.id === job.id}
                  onClick={() => void why(job, score)}
                >
                  Why this match
                </Button>
              </div>
              {activeJob?.id === job.id && whyAi.text && (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">
                  {whyAi.text}
                </p>
              )}
              {activeJob?.id === job.id && whyAi.error && (
                <p className="mt-3 text-sm text-bad">{whyAi.error}</p>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
