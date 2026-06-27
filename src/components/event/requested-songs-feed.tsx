"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ListMusic } from "lucide-react";
import { MusicPreviewCard } from "@/components/event/music-preview-card";
import { DarkCard } from "@/components/ui/dark-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { SongRequest } from "@/lib/types";

function sortRequests(items: SongRequest[]) {
  return [...items].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function RequestedSongsFeed({ eventId, requestHref, initialRequests }: { eventId: string; requestHref: string; initialRequests: SongRequest[] }) {
  const [requests, setRequests] = useState<SongRequest[]>(() => sortRequests(initialRequests));

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase
      .from("song_requests")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (data) setRequests(sortRequests(data as SongRequest[]));
      });

    const channel = supabase
      .channel("public-requested-songs-" + eventId)
      .on("postgres_changes", { event: "*", schema: "public", table: "song_requests", filter: "event_id=eq." + eventId }, (payload) => {
        if (payload.eventType === "DELETE") {
          const oldRow = payload.old as Partial<SongRequest>;
          setRequests((current) => current.filter((item) => item.id !== oldRow.id));
          return;
        }

        const next = payload.new as SongRequest;
        setRequests((current) => sortRequests([next, ...current.filter((item) => item.id !== next.id)]));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const visibleRequests = useMemo(() => requests.slice(0, 6), [requests]);

  return (
    <DarkCard>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white"><ListMusic size={18} />Requested Songs</h3>
          <p className="text-sm text-muted">Live requests from the dance floor.</p>
        </div>
        <Link href={requestHref} className="rounded-xl border border-line bg-night px-3 py-2 text-xs font-semibold text-white">Add song</Link>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {visibleRequests.length ? visibleRequests.map((request) => (
          <article key={request.id} className="rounded-[20px] border border-line bg-night p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="truncate font-semibold text-white">{request.song_title}</h4>
                <p className="truncate text-sm text-muted">{request.artist}</p>
              </div>
              <StatusBadge status={request.status} />
            </div>
            {request.music_url ? <div className="mt-3"><MusicPreviewCard url={request.music_url} title={request.song_title} artist={request.artist} compact /></div> : null}
          </article>
        )) : (
          <p className="rounded-[20px] border border-line bg-night px-4 py-5 text-center text-sm text-muted md:col-span-2">Requests will appear here during the event.</p>
        )}
      </div>
    </DarkCard>
  );
}
