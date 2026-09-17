import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CENTRE_PERFORMANCE,
  FUNNEL,
  MONTHLY_STARTS,
  PROGRAMME_KPIS,
} from "@/lib/meridian/seed";
import { STAGES } from "@/lib/meridian/types";
import { useMeridian } from "@/lib/meridian/store";
import { useAi } from "@/lib/meridian/use-ai";

export const Route = createFileRoute("/ops/")({
  component: OpsHome,
});

function OpsHome() {
  const participants = useMeridian((s) => s.participants);
  const ai = useAi();
  const k = PROGRAMME_KPIS;
  const byStage = STAGES.map((s) => ({
    label: s.short,
    count: participants.filter((p) => p.stage === s.id).length,
  }));

  async function brief() {
    const res = await ai.run(
      "ops-briefing",
      `Programme: Future Employment Support (demo). KPIs: active ${k.activeCaseload}, referrals 30d ${k.referrals30d}, job starts 30d ${k.jobStarts30d}, 13-week sustainment ${k.sustainment13}%, 26-week ${k.sustainment26}%, DNA ${k.dnaRate}%, avg days to job ${k.avgDaysToJob}, weekly self-service ${k.selfServiceWeekly}%, at risk ${k.atRisk}, overdue contacts ${k.overdueContacts}. Centres: ${CENTRE_PERFORMANCE.map((c) => `${c.centre} caseload ${c.caseload} starts ${c.starts} sustain ${c.sustain}% DNA ${c.dna}%`).join("; ")}. Funnel: ${FUNNEL.map((f) => `${f.stage} ${f.value}`).join(" → ")}.`,
    );
    if (!res.ok) toast.error(res.error);
  }

  return (
    <div>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl leading-tight sm:text-4xl">
            Programme performance
          </h1>
          <p className="mt-2 max-w-xl text-muted">
            Future Employment Support — live operational picture across Manchester,
            Birmingham and London.
          </p>
        </div>
        <Button onClick={() => void brief()} disabled={ai.loading}>
          <Sparkles className="size-4" />
          {ai.loading ? "Drafting" : "Weekly narrative"}
        </Button>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active caseload", value: k.activeCaseload.toLocaleString() },
          { label: "Job starts · 30d", value: k.jobStarts30d },
          { label: "13-week sustainment", value: `${k.sustainment13}%` },
          { label: "26-week sustainment", value: `${k.sustainment26}%` },
          { label: "Referrals · 30d", value: k.referrals30d },
          { label: "DNA rate", value: `${k.dnaRate}%` },
          { label: "Days to first job", value: k.avgDaysToJob },
          { label: "Weekly self-service", value: `${k.selfServiceWeekly}%` },
        ].map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <p className="text-xs font-medium tracking-wide text-subtle uppercase">
              {kpi.label}
            </p>
            <p className="mt-2 font-display text-3xl tabular-nums leading-none">
              {kpi.value}
            </p>
          </Card>
        ))}
      </div>

      {ai.text && (
        <Card className="mt-6">
          <h2 className="font-display text-xl">Contract manager briefing</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{ai.text}</p>
        </Card>
      )}
      {ai.error && <p className="mt-4 text-sm text-bad">{ai.error}</p>}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl">Starts versus referrals</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_STARTS}>
                <CartesianGrid stroke="var(--color-line)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--color-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-line)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="referrals" fill="var(--color-sage)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="starts" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-xl">Outcome funnel</h2>
          <ul className="mt-4 space-y-3">
            {FUNNEL.map((row) => {
              const pct = Math.round((row.value / FUNNEL[0].value) * 100);
              return (
                <li key={row.stage}>
                  <div className="flex justify-between text-sm">
                    <span>{row.stage}</span>
                    <span className="tabular-nums text-muted">
                      {row.value.toLocaleString()} · {pct}%
                    </span>
                  </div>
                  <Progress className="mt-1.5" value={pct} />
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="font-display text-xl">Centre view</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="text-xs font-medium tracking-wide text-subtle uppercase">
              <tr>
                <th className="py-2 pr-4">Centre</th>
                <th className="py-2 pr-4">Caseload</th>
                <th className="py-2 pr-4">Starts 30d</th>
                <th className="py-2 pr-4">13-week</th>
                <th className="py-2">DNA</th>
              </tr>
            </thead>
            <tbody>
              {CENTRE_PERFORMANCE.map((c) => (
                <tr key={c.centre} className="border-t border-line">
                  <td className="py-3 pr-4 font-medium">{c.centre}</td>
                  <td className="py-3 pr-4 tabular-nums">{c.caseload}</td>
                  <td className="py-3 pr-4 tabular-nums">{c.starts}</td>
                  <td className="py-3 pr-4 tabular-nums">{c.sustain}%</td>
                  <td className="py-3 tabular-nums">{c.dna}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">
          Demo caseload by stage:{" "}
          {byStage
            .filter((s) => s.count)
            .map((s) => `${s.label} ${s.count}`)
            .join(" · ")}
        </p>
      </Card>
    </div>
  );
}
