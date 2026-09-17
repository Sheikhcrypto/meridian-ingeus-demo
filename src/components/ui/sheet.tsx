import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;

export function SheetContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40" />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(92vw,22rem)] flex-col bg-paper p-5 shadow-[var(--shadow-lift)] outline-none",
          className,
        )}
        {...props}
      >
        <DialogPrimitive.Close
          className="absolute right-2 top-2 flex size-11 items-center justify-center rounded-md text-muted hover:bg-sage"
          aria-label="Close menu"
        >
          <X className="size-4" />
        </DialogPrimitive.Close>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
