import { cn } from "@/lib/utils";

export function MeridianMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-accent", className)}
      aria-hidden="true"
    >
      <circle
        cx="16"
        cy="16"
        r="13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="6"
        ry="13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M3.5 16h25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}
