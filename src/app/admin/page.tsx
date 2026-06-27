import Link from "next/link";
import { CalendarDays, Gift, HeartHandshake, ListMusic, Radio, Sparkles } from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";
import { DarkCard } from "@/components/ui/dark-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAdminData } from "@/lib/data";
import { formatDateTime, formatEventDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const data = await getAdminData();
  const metrics = data.metrics;
  const activeEvent = data.events.find((event) => event.status === "Live") || data.events[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-violet">Dashboard</p>
        <h1 className="mt-1 text-3xl font-black text-white">Active Event Control</h1>
        <p className="mt-1 text-sm text-muted">Manage DJs, venues, requests, polls, promos and screen mode.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active events" value={metrics.activeEvents} icon={<CalendarDays size={20} />} />
        <MetricCard label="Total song requests" value={metrics.totalSongRequests} icon={<ListMusic size={20} />} />
        <MetricCard label="Pending requests" value={metrics.pendingRequests} icon={<Sparkles size={20} />} />
        <MetricCard label="Total votes" value={metrics.totalVotes} icon={<Radio size={20} />} />
        <MetricCard label="Active promos" value={metrics.activePromos} icon={<Gift size={20} />} />
        <MetricCard label="Tips link clicks" value={metrics.tipClicks} icon={<HeartHandshake size={20} />} />
        <MetricCard label="Upcoming events" value={metrics.upcomingEvents} icon={<CalendarDays size={20} />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <DarkCard>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">Active event list</h2>
              <p className="mt-1 text-sm text-muted">Open the live control panels.</p>
            </div>
            <StatusBadge status="LIVE" />
          </div>
          <div className="mt-4 space-y-3">
            {data.events.map((event) => (
              <Link key={event.id} href={"/admin/events/" + event.id} className="block rounded-[20px] border border-line bg-night p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{event.name}</h3>
                    <p className="text-sm text-muted">{formatEventDate(event.event_date)} · {event.city}</p>
                  </div>
                  <StatusBadge status={event.status === "Live" ? "LIVE" : event.status} />
                </div>
              </Link>
            ))}
          </div>
        </DarkCard>

        <DarkCard>
          <h2 className="text-xl font-bold text-white">Recent song requests</h2>
          <div className="mt-4 space-y-3">
            {data.songRequests.slice(0, 5).map((request) => (
              <article key={request.id} className="rounded-[20px] border border-line bg-night p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{request.song_title}</h3>
                    <p className="text-sm text-muted">{request.artist} · {request.guest_name}</p>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
                <p className="mt-2 text-xs text-zinc-500">{formatDateTime(request.created_at)}</p>
              </article>
            ))}
          </div>
        </DarkCard>
      </div>

      <DarkCard>
        <h2 className="text-xl font-bold text-white">Quick actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Link className="gradient-button rounded-2xl px-4 py-3 text-center font-semibold" href={"/admin/events/" + activeEvent.id + "/requests"}>Song Requests</Link>
          <Link className="rounded-2xl border border-line bg-night px-4 py-3 text-center font-semibold" href={"/admin/events/" + activeEvent.id + "/polls"}>Live Polls</Link>
          <Link className="rounded-2xl border border-line bg-night px-4 py-3 text-center font-semibold" href={"/admin/events/" + activeEvent.id + "/drinks"}>Drinks Menu</Link>
          <Link className="rounded-2xl border border-line bg-night px-4 py-3 text-center font-semibold" href={"/admin/events/" + activeEvent.id + "/promos"}>Event Promos</Link>
        </div>
      </DarkCard>
    </div>
  );
}
