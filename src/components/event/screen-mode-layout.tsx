import { Instagram, Music2, QrCode } from "lucide-react";
import { QRCard } from "@/components/event/qr-card";
import { PromoCard } from "@/components/event/promo-card";
import { DarkCard } from "@/components/ui/dark-card";
import type { EventBundle } from "@/lib/types";
import { formatEventDate, getPublicEventUrl } from "@/lib/utils";

export function ScreenModeLayout({ bundle }: { bundle: EventBundle }) {
  const url = getPublicEventUrl(bundle.event);

  return (
    <main className="min-h-screen bg-night p-6 text-white lg:p-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <DarkCard className="overflow-hidden p-0">
            {bundle.event.banner_url ? <img src={bundle.event.banner_url} alt={bundle.event.name} className="h-72 w-full object-cover" /> : null}
            <div className="p-6 lg:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet">Screen Mode</p>
              <h1 className="mt-2 text-5xl font-black text-white lg:text-7xl">{bundle.event.name}</h1>
              <p className="mt-4 text-2xl text-zinc-300">{bundle.dj.name} · {bundle.venue?.name || "Live Venue"}</p>
              <p className="mt-3 text-xl text-muted">Scan to request songs, vote and see promos</p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-300">
                <span className="rounded-full border border-line px-4 py-2">LIVE</span>
                <span className="rounded-full border border-line px-4 py-2">{formatEventDate(bundle.event.event_date)}</span>
                {bundle.dj.instagram_url ? <span className="flex items-center gap-2 rounded-full border border-line px-4 py-2"><Instagram size={16} />@alexbeatdj</span> : null}
              </div>
            </div>
          </DarkCard>

          <div className="grid gap-4 md:grid-cols-2">
            {bundle.promos.slice(0, 2).map((promo) => <PromoCard key={promo.id} promo={promo} />)}
          </div>
        </section>

        <aside className="space-y-6">
          <QRCard url={url} title="Scan QR" />
          <DarkCard>
            <h2 className="flex items-center gap-2 text-xl font-bold"><Music2 size={20} />Upcoming Events</h2>
            <div className="mt-4 space-y-3">
              {bundle.upcomingEvents.map((event) => (
                <div key={event.id} className="rounded-2xl border border-line bg-night p-4">
                  <p className="font-semibold text-white">{event.name}</p>
                  <p className="text-sm text-muted">{formatEventDate(event.event_date)}</p>
                </div>
              ))}
            </div>
          </DarkCard>
          <DarkCard>
            <h2 className="flex items-center gap-2 text-xl font-bold"><QrCode size={20} />Sponsors</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {bundle.promos.map((promo) => promo.sponsor_name ? (
                <span key={promo.id} className="rounded-full border border-line px-3 py-2 text-sm text-zinc-300">{promo.sponsor_name}</span>
              ) : null)}
            </div>
          </DarkCard>
        </aside>
      </div>
    </main>
  );
}
