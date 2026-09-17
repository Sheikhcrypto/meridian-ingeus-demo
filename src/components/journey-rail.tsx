import { STAGES, type JourneyStage } from "@/lib/meridian/types";
import { cn } from "@/lib/utils";

export function JourneyRail({
  current,
  compact = false,
}: {
  current: JourneyStage;
  compact?: boolean;
}) {
  const idx = STAGES.findIndex((s) => s.id === current);
  return (
    <ol className="flex w-full items-start gap-0" aria-label="Participant journey">
      {STAGES.map((stage, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <li key={stage.id} className="flex min-w-0 flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div
                className={cn(
                  "h-px flex-1",
                  i === 0 ? "bg-transparent" : done || active ? "bg-accent" : "bg-line",
                )}
              />
              <span
                className={cn(
                  "size-2.5 shrink-0 rounded-full",
                  done && "bg-accent",
                  active && "bg-accent ring-4 ring-accent-soft",
                  !done && !active && "bg-line",
                )}
                aria-current={active ? "step" : undefined}
              />
              <div
                className={cn(
                  "h-px flex-1",
                  i === STAGES.length - 1
                    ? "bg-transparent"
                    : done
                      ? "bg-accent"
                      : "bg-line",
                )}
              />
            </div>
            {!compact && (
              <span
                className={cn(
                  "mt-2 hidden text-center text-[11px] leading-tight sm:block",
                  active ? "font-medium text-ink" : "text-subtle",
                )}
              >
                {stage.short}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
