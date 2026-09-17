import type { JobVacancy, Participant } from "./types";

const STOP = new Set([
  "and",
  "or",
  "the",
  "a",
  "to",
  "in",
  "of",
  "for",
  "with",
  "into",
]);

function tokens(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

export function scoreJob(participant: Participant, job: JobVacancy): number {
  const hay = tokens(
    [
      participant.goal,
      participant.cvSummary,
      participant.plan,
      participant.availability,
      ...participant.barriers.map((b) => b.label),
    ].join(" "),
  );
  const needle = tokens(
    [job.title, job.summary, job.hours, ...job.skills, ...job.inclusive].join(" "),
  );
  if (needle.length === 0) return 40;
  let hits = 0;
  for (const n of needle) {
    if (hay.includes(n)) hits += 1;
  }
  const overlap = hits / Math.max(needle.length, 1);
  let score = 42 + overlap * 48;

  const sameCity =
    job.location.toLowerCase().includes(participant.centre.toLowerCase()) ||
    participant.centre === "London" && /london|hackney|stratford|whitechapel|newham|beckton/i.test(
      job.location,
    );
  if (sameCity) score += 8;

  if (
    /part-time|school|term/i.test(participant.availability) &&
    /part-time|school|term|22\.5|18 hours/i.test(`${job.hours} ${job.inclusive.join(" ")}`)
  ) {
    score += 6;
  }

  if (
    participant.barriers.some((b) => /conviction|ban/i.test(b.label)) &&
    job.inclusive.some((i) => /ban the box/i.test(i))
  ) {
    score += 7;
  }

  if (
    participant.barriers.some((b) => /autism|anxiety|sensory|quiet/i.test(b.label)) &&
    /quiet|neuro|hybrid|remote|structured/i.test(
      `${job.summary} ${job.inclusive.join(" ")} ${job.hours}`,
    )
  ) {
    score += 6;
  }

  return Math.max(28, Math.min(96, Math.round(score)));
}

export function rankedJobs(participant: Participant, jobs: JobVacancy[]) {
  return jobs
    .map((job) => ({ job, score: scoreJob(participant, job) }))
    .sort((a, b) => b.score - a.score);
}
