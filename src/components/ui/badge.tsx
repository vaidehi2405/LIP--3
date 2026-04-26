import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

function Badge({ className, ...props }: BadgeProps & { variant?: "default" | "outline" }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-[rgb(var(--md3-outline)/0.4)] bg-[rgb(var(--md3-surface-container-high))] px-2.5 py-1 text-xs font-medium text-[rgb(var(--md3-on-surface))]",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
