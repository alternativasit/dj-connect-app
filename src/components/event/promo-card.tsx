"use client";

import { CalendarClock } from "lucide-react";
import { getGuestSessionId } from "@/lib/guest-session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { createClientId } from "@/lib/utils";
import { DarkCard } from "@/components/ui/dark-card";
import type { Promo } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function PromoCard({ promo }: { promo: Promo }) {
  async function trackSponsorClick() {
    if (!promo.sponsor_name) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.from("sponsor_clicks").insert({
      id: createClientId("sponsor-click"),
      event_id: promo.event_id,
      sponsor_name: promo.sponsor_name,
      guest_session_id: getGuestSessionId(),
      created_at: new Date().toISOString()
    });
  }

  return (
    <DarkCard className="overflow-hidden p-0" onClick={trackSponsorClick}>
      {promo.image_url ? <img src={promo.image_url} alt={promo.title} className="h-40 w-full object-cover" /> : null}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-magenta">Event Promos</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{promo.title}</h3>
          </div>
          <span className="rounded-full border border-line px-2 py-1 text-xs text-zinc-300">{promo.is_active ? "Active" : "Paused"}</span>
        </div>
        {promo.description ? <p className="mt-2 text-sm leading-5 text-muted">{promo.description}</p> : null}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          {promo.valid_until ? <span className="flex items-center gap-1"><CalendarClock size={14} />Valid until {formatDateTime(promo.valid_until)}</span> : null}
          {promo.sponsor_name ? <span>By {promo.sponsor_name}</span> : null}
        </div>
      </div>
    </DarkCard>
  );
}
