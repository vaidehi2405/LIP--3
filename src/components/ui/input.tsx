import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-[rgb(var(--md3-outline)/0.5)] bg-[rgb(var(--md3-surface-container-high))] px-3 py-2 text-sm text-[rgb(var(--md3-on-surface))] ring-offset-white placeholder:text-[rgb(var(--md3-on-surface)/0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--md3-primary))] disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-slate-950",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
