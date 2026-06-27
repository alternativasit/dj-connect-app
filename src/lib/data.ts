import { getSupabaseServerClient } from "@/lib/supabase/client";
import type {
  AdminData,
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

function buildAdminData(input: Omit<AdminData, "metrics">): AdminData {
  const metrics: DashboardMetrics = {
    activeEvents: input.events.filter((item) => item.status === "Live" && item.is_active).length,
    totalSongRequests: input.songRequests.length,
    pendingRequests: input.songRequests.filter((item) => item.status === "Pending").length,
    totalVotes: input.pollVotes.length,
    activePromos: input.promos.filter((item) => item.is_active).length,
    tipClicks: input.tipClicks.length,
    upcomingEvents: input.events.filter((item) => item.status !== "Finished" && item.is_active).length
  };

  return { metrics, ...input };
}

function getSeedAdminData(): AdminData {
  return buildAdminData({
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
  });
}

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

export async function getAdminData(): Promise<AdminData> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return getSeedAdminData();

  try {
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

    if (events.error || songRequests.error) return getSeedAdminData();

    return buildAdminData({
      djs: (djs.data || []) as DJ[],
      venues: (venues.data || []) as Venue[],
      events: (events.data || []) as EventRecord[],
      songRequests: (songRequests.data || []) as SongRequest[],
      polls: (polls.data || []) as Poll[],
      pollOptions: (pollOptions.data || []) as PollOption[],
      pollVotes: (pollVotes.data || []) as PollVote[],
      drinks: (drinks.data || []) as Drink[],
      promos: (promos.data || []) as Promo[],
      packages: (packagesResult.data || []) as DJPackage[],
      gallery: (gallery.data || []) as GalleryItem[],
      tipClicks: (tipClicks.data || []) as TipClick[]
    });
  } catch {
    return getSeedAdminData();
  }
}

export async function getEventById(eventId: string) {
  const found = seedEvents.find((item) => item.id === eventId || item.slug === eventId) || seedEvents[0];
  const bundle = await getEventBundle(found.slug);
  return bundle;
}
