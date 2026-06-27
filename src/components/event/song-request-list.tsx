"use client";

import { useEffect, useMemo, useState } from "react";
import { Music2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { getGuestSessionId, getStoredRequests } from "@/lib/guest-session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/utils";
import type { SongRequest } from "@/lib/types";

export function SongRequestList({ eventId, requests = [] }: { eventId: string; requests?: SongRequest[] }) {
  const [items, setItems] = useState<SongRequest[]>(requests);

  useEffect(() => {
    const sessionId = getGuestSessionId();
    setItems(getStoredRequests(eventId));
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase
      .from("song_requests")
      .select("*")
      .eq("event_id", eventId)
      .eq("guest_session_id", sessionId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setItems(data as SongRequest[]);
      });

    const channel = supabase
      .channel("guest-song-requests-" + eventId + "-" + sessionId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "song_requests", filter: "event_id=eq." + eventId },
        (payload) => {
          const next = payload.new as SongRequest;
          if (next.guest_session_id !== sessionId) return;
          setItems((current) => [next, ...current.filter((item) => item.id !== next.id)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const sorted = useMemo(() => [...items].sort((a, b) => b.created_at.localeCompare(a.created_at)), [items]);

  if (!sorted.length) {
    return (
      <div className="rounded-[22px] border border-line bg-surface p-4 text-center text-sm text-muted">
        My Requests will appear here after you send one.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((request) => (
        <article key={request.id} className="rounded-[22px] border border-line bg-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-semibold text-white"><Music2 size={15} />{request.song_title}</p>
              <p className="mt-1 text-sm text-muted">{request.artist}</p>
              {request.note ? <p className="mt-2 text-xs text-zinc-400">{request.note}</p> : null}
            </div>
            <StatusBadge status={request.status} />
          </div>
          <p className="mt-3 text-xs text-zinc-500">{formatDateTime(request.created_at)}</p>
        </article>
      ))}
    </div>
  );
}
