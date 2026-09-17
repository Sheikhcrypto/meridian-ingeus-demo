import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Menu } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { MeridianMark } from "@/components/meridian-mark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMeridian } from "@/lib/meridian/store";
import type { Role } from "@/lib/meridian/types";
import { cn } from "@/lib/utils";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

const ROLES: { id: Role; label: string; path: string }[] = [
  { id: "advisor", label: "Advisor", path: "/advisor" },
  { id: "participant", label: "Participant", path: "/participant" },
  { id: "ops", label: "Operations", path: "/ops" },
];

export function HydrateGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const result = useMeridian.persist.rehydrate();
    void Promise.resolve(result).then(() => setReady(true));
  }, []);
  if (!ready) {
    return (
      <div className="flex min-h-screen items-start gap-2.5 bg-paper px-5 py-5">
        <MeridianMark className="size-8" />
        <div>
          <p className="font-display text-lg leading-none">Meridian</p>
          <p className="text-[11px] text-subtle">Loading workspace</p>
        </div>
      </div>
    );
  }
  return children;
}

function NavLinks({
  items,
  onNavigate,
}: {
  items: NavItem[];
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1" aria-label="Primary">
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          item.to === pathname ||
          (item.to !== "/advisor" &&
            item.to !== "/participant" &&
            item.to !== "/ops" &&
            pathname.startsWith(item.to));
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
              active ? "bg-sage text-ink" : "text-muted hover:bg-sage/70 hover:text-ink",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function RoleSwitcher() {
  const role = useMeridian((s) => s.role);
  const setRole = useMeridian((s) => s.setRole);
  const navigate = useNavigate();
  return (
    <div className="rounded-xl bg-sage p-1">
      <p className="px-2 pt-1.5 pb-1 text-[11px] font-medium tracking-wide text-subtle uppercase">
        View as
      </p>
      <div className="flex flex-col">
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => {
              setRole(r.id);
              void navigate({ to: r.path });
            }}
            className={cn(
              "min-h-10 rounded-lg px-3 text-left text-sm",
              role === r.id ? "bg-surface text-ink shadow-[var(--shadow-border)]" : "text-muted",
            )}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-1">
      <MeridianMark className="size-8" />
      <div>
        <p className="font-display text-lg leading-none">Meridian</p>
        <p className="text-[11px] text-subtle">Employment services</p>
      </div>
    </Link>
  );
}

export function AppShell({
  items,
  eyebrow,
  children,
}: {
  items: NavItem[];
  eyebrow: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <HydrateGate>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="min-h-screen bg-paper">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-paper px-4 py-5 lg:flex">
          <Brand />
          <div className="mt-8 flex-1">
            <NavLinks items={items} />
          </div>
          <RoleSwitcher />
        </aside>

        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-paper/90 px-4 py-2 backdrop-blur-sm lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <Brand />
        </header>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent className="gap-6">
            <Brand />
            <NavLinks items={items} onNavigate={() => setOpen(false)} />
            <RoleSwitcher />
          </SheetContent>
        </Sheet>

        <div className="lg:pl-60">
          <div className="mx-auto max-w-6xl px-4 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-12">
            <p className="text-xs font-medium tracking-wide text-subtle uppercase">
              {eyebrow}
            </p>
            <main id="main">{children}</main>
          </div>
        </div>

        <nav
          className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 px-2 py-1 backdrop-blur-sm lg:hidden"
          aria-label="Mobile"
        >
          <div className="mx-auto flex max-w-lg">
            {items.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.to ||
                (item.to !== "/advisor" &&
                  item.to !== "/participant" &&
                  item.to !== "/ops" &&
                  pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-[11px]",
                    active ? "text-accent" : "text-muted",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </HydrateGate>
  );
}
