import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getMusicPreview } from "@/lib/music-preview";
import { getSupabaseServerClient } from "@/lib/supabase/client";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

const apiSongRequestSchema = z.object({
  event_id: z.string().uuid(),
  dj_id: z.string().uuid(),
  guest_name: z.string().min(2).max(80),
  song_title: z.string().min(1).max(120),
  artist: z.string().min(1).max(120),
  music_url: z.string().url().max(500).nullable().optional(),
  note: z.string().max(240).nullable().optional(),
  guest_session_id: z.string().min(4).max(160)
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({ ok: true, message: "Song requests API is ready" });
}

function isMissingMediaColumn(message: string) {
  return message.includes("music_url") || message.includes("music_provider") || message.includes("music_preview") || message.includes("schema cache");
}

function getGuestSafeError(message: string) {
  if (message.includes("row-level security")) {
    return "This event is not accepting requests yet. Ask the DJ to set it to Live.";
  }
  return message || "Could not send your request. Try again.";
}

export async function POST(request: Request) {
  const parsed = apiSongRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the request fields." }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient() || getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 500 });
  }

  const { data: eventRecord, error: eventError } = await supabase
    .from("events")
    .select("id,dj_id,status,is_active")
    .eq("id", parsed.data.event_id)
    .maybeSingle();

  if (eventError) {
    return NextResponse.json({ error: getGuestSafeError(eventError.message) }, { status: 400 });
  }

  if (!eventRecord || eventRecord.status !== "Live" || eventRecord.is_active !== true) {
    return NextResponse.json({ error: "This event is not accepting requests yet. Ask the DJ to set it to Live." }, { status: 409 });
  }

  const now = new Date().toISOString();
  const preview = getMusicPreview(parsed.data.music_url, parsed.data.song_title + " - " + parsed.data.artist);
  const baseSongRequest = {
    id: randomUUID(),
    event_id: parsed.data.event_id,
    dj_id: eventRecord.dj_id || parsed.data.dj_id,
    guest_name: parsed.data.guest_name,
    song_title: parsed.data.song_title,
    artist: parsed.data.artist,
    note: parsed.data.note || null,
    status: "Pending" as const,
    guest_session_id: parsed.data.guest_session_id,
    created_at: now,
    updated_at: now
  };
  const songRequest = {
    ...baseSongRequest,
    music_url: preview?.externalUrl || null,
    music_provider: preview?.provider || null,
    music_preview_image_url: preview?.imageUrl || null,
    music_preview_embed_url: preview?.embedUrl || null
  };

  const { error } = await supabase.from("song_requests").insert(songRequest);
  if (error) {
    if (isMissingMediaColumn(error.message)) {
      const fallback = await supabase.from("song_requests").insert(baseSongRequest);
      if (fallback.error) return NextResponse.json({ error: getGuestSafeError(fallback.error.message) }, { status: 400 });
      return NextResponse.json({ songRequest });
    }
    return NextResponse.json({ error: getGuestSafeError(error.message) }, { status: 400 });
  }

  return NextResponse.json({ songRequest });
}
