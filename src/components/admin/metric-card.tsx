import type { ReactNode } from "react";
import { DarkCard } from "@/components/ui/dark-card";

export function MetricCard({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) {
  return (
    <DarkCard>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <strong className="mt-1 block text-3xl font-black text-white">{value}</strong>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-line bg-night text-violet">{icon}</div>
      </div>
    </DarkCard>
  );
}
