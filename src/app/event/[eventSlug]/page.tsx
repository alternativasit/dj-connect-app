import Link from "next/link";
import { CalendarDays, Gift, GlassWater, HeartHandshake, Music2, Radio, Sparkles, UserRound } from "lucide-react";
import { AppShell } from "@/components/event/app-shell";
import { DJProfileCard } from "@/components/event/dj-profile-card";
import { EventCard } from "@/components/event/event-card";
import { FeatureCard } from "@/components/event/feature-card";
import { QRCard } from "@/components/event/qr-card";
import { RequestedSongsFeed } from "@/components/event/requested-songs-feed";
import { DarkCard } from "@/components/ui/dark-card";
import { getEventBundle } from "@/lib/data";
import { formatEventDate, getPublicEventUrl } from "@/lib/utils";

export default async function EventHomePage({ params }: { params: { eventSlug: string } }) {
  const bundle = await getEventBundle(params.eventSlug);
  const base = "/event/" + bundle.event.slug;
  const url = getPublicEventUrl(bundle.event);
  const features = [
    { title: "Request a Song", text: "Send Request and track My Requests.", href: base + "/request-song", icon: <Music2 size={22} /> },
    { title: "Live Polls", text: "Vote in genre and song polls in real time.", href: base + "/polls", icon: <Radio size={22} /> },
    { title: "Drinks Menu", text: "Browse cocktails, beer, shots and specials.", href: base + "/drinks", icon: <GlassWater size={22} /> },
    { title: "Event Promos", text: "See offers from the venue and sponsors.", href: base + "/promos", icon: <Gift size={22} /> },
    { title: "Tip the DJ", text: "Open PayPal, Venmo, Cash App and more.", href: base + "/tip", icon: <HeartHandshake size={22} /> },
    { title: "DJ Profile", text: "Follow, book and see packages.", href: base + "/dj", icon: <UserRound size={22} /> }
  ];

  return (
    <AppShell eventSlug={bundle.event.slug} title={bundle.event.name} subtitle={bundle.venue?.name || bundle.dj.name} status={bundle.event.status}>
      <div className="space-y-5">
        <EventCard event={bundle.event} dj={bundle.dj} venue={bundle.venue} />

        <DarkCard className="relative overflow-hidden">
          <div className="relative z-10">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-magenta"><Sparkles size={14} />DJ Connect</p>
            <h2 className="mt-2 text-3xl font-black text-white">Connect with the DJ in real time</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">See the menu, request songs, vote and more.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#qr" className="gradient-button rounded-2xl px-5 py-3 text-sm font-semibold text-white">Scan QR</a>
              <Link href={base + "/request-song"} className="rounded-2xl border border-line bg-surface2 px-5 py-3 text-sm font-semibold text-white">Request a Song</Link>
            </div>
          </div>
        </DarkCard>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
        </div>

        <RequestedSongsFeed eventId={bundle.event.id} requestHref={base + "/request-song"} initialRequests={bundle.songRequests} />

        <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <DJProfileCard dj={bundle.dj} href={base + "/dj"} />
          <QRCard url={url} />
        </div>

        <DarkCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
              <p className="text-sm text-muted">Next chances to catch {bundle.dj.name} live.</p>
            </div>
            <CalendarDays className="text-violet" size={22} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {bundle.upcomingEvents.map((event) => (
              <article key={event.id} className="rounded-[20px] border border-line bg-night p-4">
                <h4 className="font-semibold text-white">{event.name}</h4>
                <p className="mt-1 text-sm text-muted">{formatEventDate(event.event_date)}</p>
              </article>
            ))}
          </div>
        </DarkCard>
      </div>
    </AppShell>
  );
}

