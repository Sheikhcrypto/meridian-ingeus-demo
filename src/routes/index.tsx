import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, LineChart, UserRound } from "lucide-react";
import { MeridianMark } from "@/components/meridian-mark";
import { Button } from "@/components/ui/button";
import { STAGES } from "@/lib/meridian/types";
import { useMeridian } from "@/lib/meridian/store";
import type { Role } from "@/lib/meridian/types";

export const Route = createFileRoute("/")({ component: Home });

const ROLES: {
  id: Role;
  path: "/advisor" | "/participant" | "/ops";
  title: string;
  kicker: string;
  body: string;
  icon: typeof UserRound;
}[] = [
  {
    id: "advisor",
    path: "/advisor",
    title: "Advisor workspace",
    kicker: "Enablement",
    body: "Caseload, contact cadence, personalised plans, and AI that drafts so you can spend time with people.",
    icon: ClipboardList,
  },
  {
    id: "participant",
    path: "/participant",
    title: "Participant portal",
    kicker: "Self-service",
    body: "See your journey, update My Life / Skills / Work / Aspirations, match jobs, and practise interviews.",
    icon: UserRound,
  },
  {
    id: "ops",
    path: "/ops",
    title: "Programme operations",
    kicker: "Performance",
    body: "Referrals to 26-week sustainment, centre view, and a weekly narrative your contract manager can stand behind.",
    icon: LineChart,
  },
];

function Home() {
  const navigate = useNavigate();
  const setRole = useMeridian((s) => s.setRole);

  function enter(role: Role, path: "/advisor" | "/participant" | "/ops") {
    setRole(role);
    void navigate({ to: path });
  }

  return (
    <div className="min-h-screen bg-paper">
        <a
          href="#roles"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
        >
          Skip to roles
        </a>
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 lg:px-8">
          <div className="flex items-center gap-2.5">
            <MeridianMark className="size-8" />
            <div>
              <p className="font-display text-lg leading-none">Meridian</p>
              <p className="text-[11px] text-subtle">Next-generation employment services</p>
            </div>
          </div>
          <p className="hidden text-sm text-muted sm:block">FES · UK providers</p>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-20 lg:px-8">
          <section className="grid gap-10 pt-6 lg:grid-cols-12 lg:gap-12 lg:pt-10">
            <div className="lg:col-span-7">
              <p className="text-xs font-medium tracking-wide text-accent uppercase">
                Built for the employment journey
              </p>
              <h1 className="mt-3 max-w-xl font-display text-4xl leading-[1.12] text-ink sm:text-5xl">
                From referral to a job that holds.
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted sm:text-lg">
                Meridian is the platform Ingeus-style providers are procuring:
                end-to-end participant management, advisor enablement, workflow,
                digital self-service, and AI-assisted administration — without
                replacing the human in the room.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={() => enter("advisor", "/advisor")}>
                  Open advisor demo
                  <ArrowRight className="size-4" />
                </Button>
                <Button variant="outline" onClick={() => enter("participant", "/participant")}>
                  Try as a participant
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)]">
                <p className="text-xs font-medium tracking-wide text-subtle uppercase">
                  Journey orchestration
                </p>
                <ol className="mt-4 grid grid-cols-3 gap-2">
                  {STAGES.map((stage) => (
                    <li
                      key={stage.id}
                      className="rounded-xl bg-sage px-3 py-3 text-sm leading-snug"
                    >
                      {stage.label}
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-sm text-muted">
                  Assessment uses the four pillars — My Life, My Skills, My Work,
                  My Aspirations — then workflow carries the case through
                  interventions, job start, and sustainment.
                </p>
              </div>
            </div>
          </section>

          <section id="roles" className="mt-16 grid gap-4 md:grid-cols-3">
            {ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => enter(role.id, role.path)}
                  className="group rounded-2xl bg-surface p-5 text-left shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-200 hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium tracking-wide text-subtle uppercase">
                      {role.kicker}
                    </span>
                    <Icon className="size-4 text-accent" />
                  </div>
                  <h2 className="mt-3 font-display text-2xl leading-snug">{role.title}</h2>
                  <p className="mt-2 text-sm text-muted">{role.body}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    Enter
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              );
            })}
          </section>

          <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Participant engagement",
              "Advisor enablement",
              "Workflow orchestration",
              "Reporting & analytics",
              "Digital self-service",
              "AI-assisted administration",
              "WCAG-oriented access",
              "Government & partner integrations",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink"
              >
                {item}
              </div>
            ))}
          </section>

          <p className="mt-10 max-w-2xl text-sm text-subtle">
            Preview uses realistic Future Employment Support caseload data. AI
            drafts plans, notes, CVs and interview practice; advisors and
            participants always decide what is saved. No live DWP connection in
            this demonstration.
          </p>
        </main>
      </div>
  );
}
