import type { EventStatus, SongRequestStatus } from "@/lib/types";
import { cn, statusTone } from "@/lib/utils";

type BadgeStatus = SongRequestStatus | EventStatus | "LIVE";

export function StatusBadge({ status, className }: { status: BadgeStatus; className?: string }) {
  const normalizedStatus = status.toLowerCase();
  const label = normalizedStatus === "live" ? "LIVE" : status;
  const tone = normalizedStatus === "live"
    ? "animate-pulse border-emerald-400/80 bg-emerald-400/15 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.48)]"
    : status === "Draft"
      ? "border-amber-400/70 bg-amber-400/15 text-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.18)]"
      : status === "Finished"
        ? "border-red-500/70 bg-red-500/15 text-red-100 shadow-[0_0_12px_rgba(239,68,68,0.16)]"
        : statusTone(status as SongRequestStatus);

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", tone, className)}>
      {label}
    </span>
  );
}
