import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,box-shadow] duration-150 ease-[var(--ease-out-soft)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-h-11 px-4",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-fg hover:opacity-90 active:scale-[0.98]",
        secondary:
          "bg-sage text-ink hover:bg-line active:scale-[0.98]",
        outline:
          "bg-surface text-ink shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-lift)]",
        ghost: "text-ink hover:bg-sage",
        danger: "bg-bad text-accent-fg hover:opacity-90",
        link: "text-accent underline-offset-4 hover:underline min-h-0 px-0",
      },
      size: {
        default: "h-11",
        sm: "h-9 min-h-9 px-3 text-sm",
        lg: "h-12 px-5",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
