import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function DarkCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[22px] border border-line bg-surface/95 p-4 shadow-glow backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
