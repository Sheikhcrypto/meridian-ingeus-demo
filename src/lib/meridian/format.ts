import { STAGES, type JourneyStage, type Participant, type RiskLevel } from "./types";

export function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function daysSince(iso: string) {
  if (!iso) return 0;
  const then = new Date(`${iso}T12:00:00`).getTime();
  return Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
}

export function stageLabel(stage: JourneyStage) {
  return STAGES.find((s) => s.id === stage)?.label ?? stage;
}

export function riskTone(risk: RiskLevel): "good" | "warn" | "bad" {
  if (risk === "high") return "bad";
  if (risk === "medium") return "warn";
  return "good";
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function participantBrief(p: Participant) {
  return [
    `Name: ${p.preferredName} ${p.lastName}, ${p.age || "age unknown"}, ${p.pronouns}`,
    `Centre: ${p.centre} · Programme: ${p.programme}`,
    `Stage: ${stageLabel(p.stage)} · Risk: ${p.risk} · Days on programme: ${p.daysOnProgramme}`,
    `Goal: ${p.goal}`,
    `Availability: ${p.availability}`,
    `UC status: ${p.ucStatus}`,
    `Barriers: ${p.barriers.map((b) => `${b.label} (${b.kind})`).join("; ") || "none listed"}`,
    `Assessment — Life ${p.assessment.life}, Skills ${p.assessment.skills}, Work ${p.assessment.work}, Aspirations ${p.assessment.aspirations}`,
    `Last contact: ${p.lastContact} · Next action: ${p.nextAction}`,
    `Applications ${p.jobsApplied}, interviews ${p.interviews}, engagement ${p.engagement}%`,
    p.outcome
      ? `Outcome: ${p.outcome.role} at ${p.outcome.employer} from ${p.outcome.startDate}, week ${p.outcome.sustainmentWeek}`
      : "No employment outcome yet",
    `Current plan: ${p.plan || "none"}`,
    `CV summary: ${p.cvSummary || "none"}`,
    `Open actions: ${p.actions
      .filter((a) => !a.done)
      .map((a) => `${a.title} (${a.owner}, due ${a.due})`)
      .join("; ")}`,
    `Latest notes: ${p.notes
      .slice(0, 3)
      .map((n) => `${n.at} ${n.author}: ${n.body}`)
      .join(" | ")}`,
  ].join("\n");
}
