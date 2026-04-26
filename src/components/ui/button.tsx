import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--md3-primary))] disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950",
  {
    variants: {
      variant: {
        default: "bg-[rgb(var(--md3-primary))] text-[rgb(var(--md3-on-primary))] hover:brightness-95 active:scale-[0.99] shadow-sm",
        outline: "border border-[rgb(var(--md3-outline)/0.5)] bg-[rgb(var(--md3-surface-container-high))] text-[rgb(var(--md3-on-surface))] hover:bg-[rgb(var(--md3-secondary-container)/0.6)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
