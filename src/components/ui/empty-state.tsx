import type { ReactNode } from "react";
import { DarkCard } from "@/components/ui/dark-card";

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <DarkCard className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="h-10 w-10 rounded-2xl border border-line bg-surface2" />
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {text ? <p className="mt-1 text-sm text-muted">{text}</p> : null}
      </div>
      {action}
    </DarkCard>
  );
}
