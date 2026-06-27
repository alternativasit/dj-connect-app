import Link from "next/link";
import { Radio } from "lucide-react";

import { AdminReturnLink } from "@/components/event/admin-return-link";
import { EventStatusLiveBadge } from "@/components/event/event-status-live-badge";
import type { EventStatus } from "@/lib/types";

export function Header({
  title = "DJ Connect",
  subtitle,
  eventSlug,
  eventId,
  status = "Live"
}: {
  title?: string;
  subtitle?: string;
  eventSlug?: string;
  eventId?: string;
  status?: EventStatus;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-night/85 px-4 py-3 backdrop-blur-xl md:rounded-b-[24px]">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <Link href={eventSlug ? "/event/" + eventSlug : "/"} className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">DJ Connect</p>
          <h1 className="truncate text-lg font-bold text-white">{title}</h1>
          {subtitle ? <p className="truncate text-xs text-muted">{subtitle}</p> : null}
        </Link>
        <div className="flex items-center gap-2">
          <AdminReturnLink />
          <EventStatusLiveBadge eventId={eventId} initialStatus={status} />
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-surface2 text-violet">
            <Radio size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
