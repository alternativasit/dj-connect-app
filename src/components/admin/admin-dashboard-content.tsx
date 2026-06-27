"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Gift, HeartHandshake, ListMusic, Radio, Sparkles } from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";
import { DarkCard } from "@/components/ui/dark-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatDateTime, formatEventDate } from "@/lib/utils";
import type { AdminData, DJ, DJPackage, Drink, EventRecord, GalleryItem, Poll, PollOption, PollVote, Promo, SongRequest, TipClick, Venue } from "@/lib/types";

function sortRequests(requests: SongRequest[]) {
  return [...requests].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function computeMetrics(data: AdminData) {
  return {
    activeEvents: data.events.filter((event) => event.status === "Live" && event.is_active).length,
    totalSongRequests: data.songRequests.length,
    pendingRequests: data.songRequests.filter((request) => request.status === "Pending").length,
    totalVotes: data.pollVotes.length,
    activePromos: data.promos.filter((promo) => promo.is_active).length,
    tipClicks: data.tipClicks.length,
    upcomingEvents: data.events.filter((event) => event.status !== "Finished" && event.is_active).length
  };
}

export function AdminDashboardContent({ initialData }: { initialData: AdminData }) {
  const [data, setData] = useState<AdminData>(() => ({ ...initialData, songRequests: sortRequests(initialData.songRequests) }));
  const [syncMessage, setSyncMessage] = useState("Syncing live data...");

  const loadDashboard = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setSyncMessage("");
      return;
    }

    const [djs, venues, events, songRequests, polls, pollOptions, pollVotes, drinks, promos, packagesResult, gallery, tipClicks] = await Promise.all([
      supabase.from("djs").select("*").order("created_at", { ascending: false }),
      supabase.from("venues").select("*").order("created_at", { ascending: false }),
      supabase.from("events").select("*").order("event_date", { ascending: true }),
      supabase.from("song_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("polls").select("*").order("created_at", { ascending: false }),
      supabase.from("poll_options").select("*").order("display_order", { ascending: true }),
      supabase.from("poll_votes").select("*").order("created_at", { ascending: false }),
      supabase.from("drinks").select("*").order("display_order", { ascending: true }),
      supabase.from("promos").select("*").order("display_order", { ascending: true }),
      supabase.from("dj_packages").select("*").order("created_at", { ascending: false }),
      supabase.from("gallery_items").select("*").order("display_order", { ascending: true }),
      supabase.from("tip_clicks").select("*").order("created_at", { ascending: false })
    ]);

    if (events.error || songRequests.error) {
      setSyncMessage("Live dashboard data could not be loaded. Check admin permissions.");
      return;
    }

    setData((current) => ({
      metrics: current.metrics,
      djs: (djs.data || current.djs) as DJ[],
      venues: (venues.data || current.venues) as Venue[],
      events: (events.data || current.events) as EventRecord[],
      songRequests: sortRequests((songRequests.data || current.songRequests) as SongRequest[]),
      polls: (polls.data || current.polls) as Poll[],
      pollOptions: (pollOptions.data || current.pollOptions) as PollOption[],
      pollVotes: (pollVotes.data || current.pollVotes) as PollVote[],
      drinks: (drinks.data || current.drinks) as Drink[],
      promos: (promos.data || current.promos) as Promo[],
      packages: (packagesResult.data || current.packages) as DJPackage[],
      gallery: (gallery.data || current.gallery) as GalleryItem[],
      tipClicks: (tipClicks.data || current.tipClicks) as TipClick[]
    }));
    setSyncMessage("Live data loaded");
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    loadDashboard();
    const channel = supabase
      .channel("admin-dashboard-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "song_requests" }, loadDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, loadDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "poll_votes" }, loadDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "promos" }, loadDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "tip_clicks" }, loadDashboard)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadDashboard]);

  const metrics = useMemo(() => computeMetrics(data), [data]);
  const activeEvent = data.events.find((event) => event.status === "Live") || data.events[0];
  const activeEventRequestsHref = activeEvent ? "/admin/events/" + activeEvent.id + "/requests" : "/admin/events";
  const activeEventPollsHref = activeEvent ? "/admin/events/" + activeEvent.id + "/polls" : "/admin/events";
  const activeEventDrinksHref = activeEvent ? "/admin/events/" + activeEvent.id + "/drinks" : "/admin/events";
  const activeEventPromosHref = activeEvent ? "/admin/events/" + activeEvent.id + "/promos" : "/admin/events";

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-violet">Dashboard</p>
        <h1 className="mt-1 text-3xl font-black text-white">Active Event Control</h1>
        <p className="mt-1 text-sm text-muted">Manage DJs, venues, requests, polls, promos and screen mode.</p>
        {syncMessage ? <p className="mt-2 text-xs text-zinc-500">{syncMessage}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active events" value={metrics.activeEvents} icon={<CalendarDays size={20} />} href="/admin/events" />
        <MetricCard label="Total song requests" value={metrics.totalSongRequests} icon={<ListMusic size={20} />} href={activeEventRequestsHref} />
        <MetricCard label="Pending requests" value={metrics.pendingRequests} icon={<Sparkles size={20} />} href={activeEventRequestsHref} />
        <MetricCard label="Total votes" value={metrics.totalVotes} icon={<Radio size={20} />} href={activeEventPollsHref} />
        <MetricCard label="Active promos" value={metrics.activePromos} icon={<Gift size={20} />} href={activeEventPromosHref} />
        <MetricCard label="Tips link clicks" value={metrics.tipClicks} icon={<HeartHandshake size={20} />} href={activeEvent ? "/event/" + activeEvent.slug + "/tip" : undefined} />
        <MetricCard label="Upcoming events" value={metrics.upcomingEvents} icon={<CalendarDays size={20} />} href="/admin/events" />
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
          <div className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto pr-1 soft-scrollbar">
            {data.events.map((event) => (
              <Link key={event.id} href={"/admin/events/" + event.id} className="block rounded-[20px] border border-line bg-night p-4 transition hover:border-violet/60 hover:bg-zinc-900/70">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{event.name}</h3>
                    <p className="text-sm text-muted">{formatEventDate(event.event_date)} - {event.city}</p>
                  </div>
                  <StatusBadge status={event.status === "Live" ? "LIVE" : event.status} />
                </div>
              </Link>
            ))}
          </div>
        </DarkCard>

        <DarkCard>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">Recent song requests</h2>
              <p className="mt-1 text-sm text-muted">Latest requests across live events.</p>
            </div>
            <Link href={activeEventRequestsHref} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-white hover:border-violet/60">Open</Link>
          </div>
          <div className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto pr-1 soft-scrollbar">
            {data.songRequests.slice(0, 8).map((request) => (
              <Link key={request.id} href={"/admin/events/" + request.event_id + "/requests"} className="block rounded-[20px] border border-line bg-night p-4 transition hover:border-violet/60 hover:bg-zinc-900/70">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{request.song_title}</h3>
                    <p className="text-sm text-muted">{request.artist} - {request.guest_name}</p>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
                <p className="mt-2 text-xs text-zinc-500">{formatDateTime(request.created_at)}</p>
              </Link>
            ))}
          </div>
        </DarkCard>
      </div>

      <DarkCard>
        <h2 className="text-xl font-bold text-white">Quick actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Link className="gradient-button rounded-2xl px-4 py-3 text-center font-semibold" href={activeEventRequestsHref}>Song Requests</Link>
          <Link className="rounded-2xl border border-line bg-night px-4 py-3 text-center font-semibold hover:border-violet/60" href={activeEventPollsHref}>Live Polls</Link>
          <Link className="rounded-2xl border border-line bg-night px-4 py-3 text-center font-semibold hover:border-violet/60" href={activeEventDrinksHref}>Drinks Menu</Link>
          <Link className="rounded-2xl border border-line bg-night px-4 py-3 text-center font-semibold hover:border-violet/60" href={activeEventPromosHref}>Event Promos</Link>
        </div>
      </DarkCard>
    </div>
  );
}
