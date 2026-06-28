import Link from "next/link";
import { ExternalLink, Music2 } from "lucide-react";
import type { DJ, EventRecord } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";

function getProfileEvent(dj: DJ, events: EventRecord[]) {
  return events
    .filter((event) => event.dj_id === dj.id && event.is_active)
    .sort((a, b) => {
      if (a.status === "Live" && b.status !== "Live") return -1;
      if (a.status !== "Live" && b.status === "Live") return 1;
      return String(a.event_date || "").localeCompare(String(b.event_date || ""));
    })[0];
}

export function DjDirectory({ djs, events }: { djs: DJ[]; events: EventRecord[] }) {
  return (
    <section className="rounded-[22px] border border-line bg-surface p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">Registered DJs</h2>
          <p className="mt-1 text-sm text-muted">View active DJ profiles and open their public pages.</p>
        </div>
        <span className="rounded-full border border-line bg-night px-3 py-1 text-xs font-semibold text-white">{djs.length} DJs</span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {djs.map((dj) => {
          const profileEvent = getProfileEvent(dj, events);
          return (
            <article key={dj.id} className="rounded-2xl border border-line bg-night p-4">
              <div className="flex items-start gap-3">
                {dj.photo_url ? (
                  <img src={dj.photo_url} alt={dj.name} className="h-14 w-14 rounded-2xl object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-surface text-violet">
                    <Music2 size={22} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-bold text-white">{dj.name}</h3>
                  <p className="text-sm text-muted">{dj.role || "DJ"}</p>
                  <p className="mt-1 text-xs text-muted">{[dj.city, dj.country].filter(Boolean).join(", ") || "Location not set"}</p>
                </div>
              </div>

              {dj.genres?.length ? <p className="mt-3 line-clamp-1 text-xs uppercase tracking-[0.12em] text-violet">{dj.genres.slice(0, 4).join(" / ")}</p> : null}

              <div className="mt-4 flex items-center justify-between gap-2">
                <span className={dj.is_active ? "rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200" : "rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted"}>{dj.is_active ? "Active" : "Inactive"}</span>
                {profileEvent ? (
                  <Link href={`/event/${profileEvent.slug}/dj`} className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-white hover:border-violet">
                    Open profile <ExternalLink size={14} />
                  </Link>
                ) : (
                  <span className="rounded-xl border border-line px-3 py-2 text-xs text-muted">No event yet</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}