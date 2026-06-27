import { CalendarDays, MapPin } from "lucide-react";
import { DarkCard } from "@/components/ui/dark-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DJ, EventRecord, Venue } from "@/lib/types";
import { formatEventDate } from "@/lib/utils";

export function EventCard({ event, dj, venue }: { event: EventRecord; dj: DJ; venue: Venue | null }) {
  return (
    <DarkCard className="overflow-hidden p-0">
      {event.banner_url ? (
        <div className="h-44 overflow-hidden md:h-60">
          <img src={event.banner_url} alt={event.name} className="h-full w-full object-cover" />
        </div>
      ) : null}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet">Active Event</p>
            <h2 className="mt-1 text-2xl font-bold text-white">{event.name}</h2>
            <p className="mt-1 text-sm text-muted">{dj.name} at {venue?.name || "Venue TBA"}</p>
          </div>
          <StatusBadge status={event.status === "Live" ? "LIVE" : event.status} />
        </div>
        <div className="mt-4 grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
          <span className="flex items-center gap-2"><CalendarDays size={16} />{formatEventDate(event.event_date)} · {event.start_time || "TBA"}</span>
          <span className="flex items-center gap-2"><MapPin size={16} />{event.city || venue?.city || "City TBA"}</span>
        </div>
      </div>
    </DarkCard>
  );
}
