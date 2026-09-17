import type { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-subtle outline-none transition-[box-shadow] duration-150 focus-visible:shadow-[0_0_0_3px_var(--color-accent-soft)]",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-subtle outline-none transition-[box-shadow] duration-150 focus-visible:shadow-[0_0_0_3px_var(--color-accent-soft)]",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("block text-sm font-medium text-ink", className)} {...props} />
  );
}
