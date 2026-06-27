import { getSupabaseServerClient } from "@/lib/supabase/client";
import type {
  DJ,
  DJPackage,
  DashboardMetrics,
  Drink,
  EventBundle,
  EventRecord,
  GalleryItem,
  Poll,
  PollOption,
  PollVote,
  Promo,
  SongRequest,
  TipClick,
  Venue
} from "@/lib/types";
import {
  getSeedBundle,
  seedDjs,
  seedDrinks,
  seedEvents,
  seedGallery,
  seedPackages,
  seedPollOptions,
  seedPollVotes,
  seedPolls,
  seedPromos,
  seedSongRequests,
  seedTipClicks,
  seedVenues
} from "@/lib/seed";

export async function getEventBundle(eventSlug: string): Promise<EventBundle> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return getSeedBundle(eventSlug);

  try {
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", eventSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !event) return getSeedBundle(eventSlug);

    const typedEvent = event as EventRecord;
    const [djResult, venueResult, requestsResult, pollsResult, drinksResult, promosResult, packagesResult, galleryResult, upcomingResult] = await Promise.all([
      supabase.from("djs").select("*").eq("id", typedEvent.dj_id).maybeSingle(),
      typedEvent.venue_id ? supabase.from("venues").select("*").eq("id", typedEvent.venue_id).maybeSingle() : Promise.resolve({ data: null, error: null }),
      supabase.from("song_requests").select("*").eq("event_id", typedEvent.id).order("created_at", { ascending: false }),
      supabase.from("polls").select("*").eq("event_id", typedEvent.id).eq("is_active", true).order("created_at", { ascending: false }),
      supabase.from("drinks").select("*").eq("event_id", typedEvent.id).order("display_order"),
      supabase.from("promos").select("*").eq("event_id", typedEvent.id).eq("is_active", true).order("display_order"),
      supabase.from("dj_packages").select("*").eq("dj_id", typedEvent.dj_id).eq("is_active", true),
      supabase.from("gallery_items").select("*").eq("dj_id", typedEvent.dj_id).order("display_order"),
      supabase.from("events").select("*").eq("dj_id", typedEvent.dj_id).neq("id", typedEvent.id).eq("is_active", true).order("event_date")
    ]);

    const polls = (pollsResult.data || []) as Poll[];
    const pollIds = polls.map((item) => item.id);
    const [optionsResult, votesResult] = pollIds.length
      ? await Promise.all([
          supabase.from("poll_options").select("*").in("poll_id", pollIds).order("display_order"),
          supabase.from("poll_votes").select("*").in("poll_id", pollIds)
        ])
      : [{ data: [] }, { data: [] }];

    return {
      event: typedEvent,
      dj: (djResult.data as DJ | null) || getSeedBundle(eventSlug).dj,
      venue: (venueResult.data as Venue | null) || null,
      upcomingEvents: (upcomingResult.data || []) as EventRecord[],
      songRequests: (requestsResult.data || []) as SongRequest[],
      polls,
      pollOptions: (optionsResult.data || []) as PollOption[],
      pollVotes: (votesResult.data || []) as PollVote[],
      drinks: (drinksResult.data || []) as Drink[],
      promos: (promosResult.data || []) as Promo[],
      packages: (packagesResult.data || []) as DJPackage[],
      gallery: (galleryResult.data || []) as GalleryItem[]
    };
  } catch {
    return getSeedBundle(eventSlug);
  }
}

export async function getAdminData() {
  const metrics: DashboardMetrics = {
    activeEvents: seedEvents.filter((item) => item.status === "Live").length,
    totalSongRequests: seedSongRequests.length,
    pendingRequests: seedSongRequests.filter((item) => item.status === "Pending").length,
    totalVotes: seedPollVotes.length,
    activePromos: seedPromos.filter((item) => item.is_active).length,
    tipClicks: seedTipClicks.length,
    upcomingEvents: seedEvents.filter((item) => item.status !== "Finished").length
  };

  return {
    metrics,
    djs: seedDjs,
    venues: seedVenues,
    events: seedEvents,
    songRequests: seedSongRequests,
    polls: seedPolls,
    pollOptions: seedPollOptions,
    pollVotes: seedPollVotes,
    drinks: seedDrinks,
    promos: seedPromos,
    packages: seedPackages,
    gallery: seedGallery,
    tipClicks: seedTipClicks as TipClick[]
  };
}

export async function getEventById(eventId: string) {
  const found = seedEvents.find((item) => item.id === eventId || item.slug === eventId) || seedEvents[0];
  const bundle = await getEventBundle(found.slug);
  return bundle;
}
