"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ListMusic, Music2, PlayCircle } from "lucide-react";

import { DarkCard } from "@/components/ui/dark-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getMusicPreview } from "@/lib/music-preview";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { SongRequest } from "@/lib/types";

function sortRequests(items: SongRequest[]) {
  return [...items].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function RequestedSongRow({ request }: { request: SongRequest }) {
  const preview = getMusicPreview(request.music_url, request.song_title + " - " + request.artist);

  return (
    <article className="grid min-h-[5.5rem] grid-cols-[5rem_1fr] gap-3 rounded-[20px] border border-line bg-night p-3">
      {preview ? (
        <a
          href={preview.externalUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={"Play " + request.song_title}
          className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-black/60 text-violet transition hover:border-violet/70"
        >
          {preview.imageUrl ? <img src={preview.imageUrl} alt={preview.title} className="h-full w-full object-cover" /> : <Music2 size={24} />}
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <PlayCircle className="drop-shadow" size={26} />
          </div>
        </a>
      ) : (
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-black/60 text-violet">
          <Music2 size={24} />
        </div>
      )}

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="truncate font-semibold text-white">{request.song_title}</h4>
            <p className="truncate text-sm text-muted">{request.artist}</p>
          </div>
          <StatusBadge status={request.status} className="shrink-0" />
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="min-w-0 truncate rounded-full border border-line bg-surface2 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-violet">
            {preview?.provider || "Song request"}
          </span>
          {preview ? (
            <a
              href={preview.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-violet/50 bg-violet/15 px-3 py-2 text-xs font-semibold text-white transition hover:border-violet hover:bg-violet/25"
            >
              <PlayCircle size={14} />
              Play Song
            </a>
          ) : (
            <span className="inline-flex shrink-0 items-center rounded-xl border border-line bg-surface2 px-3 py-2 text-xs font-semibold text-muted">
              No link
            </span>
          )}
        </div>
      </div>
    </article>
  );
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
      .limit(30)
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
        setRequests((current) => sortRequests([next, ...current.filter((item) => item.id !== next.id)]).slice(0, 30));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const feedRequests = useMemo(() => requests.slice(0, 30), [requests]);
  const hasMoreThanFive = feedRequests.length > 5;

  return (
    <DarkCard>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white"><ListMusic size={18} />Requested Songs</h3>
          <p className="text-sm text-muted">Live requests from the dance floor.</p>
        </div>
        <Link href={requestHref} className="rounded-xl border border-line bg-night px-3 py-2 text-xs font-semibold text-white">Add song</Link>
      </div>

      <div className="mt-4 rounded-[22px] border border-line bg-black/25 p-2">
        {feedRequests.length ? (
          <div className="soft-scrollbar max-h-[31rem] space-y-3 overflow-y-auto pr-1">
            {feedRequests.map((request) => <RequestedSongRow key={request.id} request={request} />)}
          </div>
        ) : (
          <p className="rounded-[20px] border border-line bg-night px-4 py-5 text-center text-sm text-muted">Requests will appear here during the event.</p>
        )}
      </div>

      {hasMoreThanFive ? <p className="mt-3 text-center text-xs text-muted">Scroll inside the list to see more requests.</p> : null}
    </DarkCard>
  );
}

