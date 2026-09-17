import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
  {
    variants: {
      tone: {
        muted: "bg-sage text-muted",
        accent: "bg-accent-soft text-accent",
        good: "bg-good-soft text-good",
        warn: "bg-warn-soft text-warn",
        bad: "bg-bad-soft text-bad",
        ink: "bg-ink text-accent-fg",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone, className }))} {...props} />;
}
