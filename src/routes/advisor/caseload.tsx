import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RiskBadge, StageBadge } from "@/components/status";
import { Input } from "@/components/ui/input";
import { STAGES } from "@/lib/meridian/types";
import { daysSince } from "@/lib/meridian/format";
import { advisorById, displayName, useMeridian } from "@/lib/meridian/store";

export const Route = createFileRoute("/advisor/caseload")({
  component: CaseloadPage,
});

function CaseloadPage() {
  const advisorId = useMeridian((s) => s.advisorId);
  const participants = useMeridian((s) => s.participants);
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("all");
  const [scope, setScope] = useState<"mine" | "all">("mine");

  const rows = useMemo(() => {
    const list =
      scope === "mine" ? participants.filter((p) => p.advisorId === advisorId) : participants;
    const query = q.trim().toLowerCase();
    return list.filter((p) => {
      if (stage !== "all" && p.stage !== stage) return false;
      if (!query) return true;
      const hay = `${p.firstName} ${p.lastName} ${p.goal} ${p.centre}`.toLowerCase();
      return hay.includes(query);
    });
  }, [participants, advisorId, q, stage, scope]);

  return (
    <div>
      <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">Caseload</h1>
      <p className="mt-2 max-w-xl text-muted">
        Search, filter, and open a file. Complex cases stay visible — risk, silence, and stage
        on one row.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, goal, centre"
          aria-label="Search caseload"
          className="sm:max-w-xs"
        />
        <select
          className="h-11 rounded-lg border border-line bg-surface px-3 text-sm"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          aria-label="Filter by stage"
        >
          <option value="all">All stages</option>
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <div className="flex rounded-xl bg-sage p-1">
          <button
            type="button"
            className={`min-h-9 rounded-lg px-3 text-sm ${scope === "mine" ? "bg-surface shadow-[var(--shadow-border)]" : "text-muted"}`}
            onClick={() => setScope("mine")}
          >
            My caseload
          </button>
          <button
            type="button"
            className={`min-h-9 rounded-lg px-3 text-sm ${scope === "all" ? "bg-surface shadow-[var(--shadow-border)]" : "text-muted"}`}
            onClick={() => setScope("all")}
          >
            Programme
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-line text-xs font-medium tracking-wide text-subtle uppercase">
            <tr>
              <th className="px-4 py-3">Participant</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Last contact</th>
              <th className="px-4 py-3">Advisor</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <Link
                    to="/advisor/participants/$participantId"
                    params={{ participantId: p.id }}
                    className="font-medium text-ink hover:text-accent"
                  >
                    {displayName(p)}
                  </Link>
                  <p className="max-w-xs truncate text-muted">{p.goal}</p>
                </td>
                <td className="px-4 py-3">
                  <StageBadge stage={p.stage} />
                </td>
                <td className="px-4 py-3">
                  <RiskBadge risk={p.risk} />
                </td>
                <td className="px-4 py-3 tabular-nums text-muted">
                  {daysSince(p.lastContact)}d
                </td>
                <td className="px-4 py-3 text-muted">
                  {advisorById(p.advisorId)?.name.split(" ")[0]}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No people match those filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
