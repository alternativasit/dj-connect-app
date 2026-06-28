import type { SongRequestStatus } from "@/lib/types";
import { cn, statusTone } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: SongRequestStatus | "LIVE" | "Draft" | "Finished"; className?: string }) {
  const tone = status === "LIVE"
    ? "animate-pulse border-emerald-400/70 bg-emerald-400/15 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.42)]"
    : status === "Draft"
      ? "border-zinc-500/50 bg-zinc-500/20 text-zinc-200"
      : status === "Finished"
        ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-100"
        : statusTone(status as SongRequestStatus);

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", tone, className)}>
      {status}
    </span>
  );
}
