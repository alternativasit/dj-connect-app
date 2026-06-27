"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ExternalLink, ListMusic, Play, Trash2, X } from "lucide-react";
import { MusicPreviewCard } from "@/components/event/music-preview-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/utils";
import type { SongRequest, SongRequestStatus } from "@/lib/types";

const statuses: SongRequestStatus[] = ["Pending", "Approved", "Played", "Rejected"];

export function AdminRequestsBoard({ eventId, initialRequests }: { eventId: string; initialRequests: SongRequest[] }) {
  const [requests, setRequests] = useState<SongRequest[]>(initialRequests);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase.from("song_requests").select("*").eq("event_id", eventId).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setRequests(data as SongRequest[]);
    });

    const channel = supabase
      .channel("admin-song-requests-" + eventId)
      .on("postgres_changes", { event: "*", schema: "public", table: "song_requests", filter: "event_id=eq." + eventId }, (payload) => {
        const next = payload.new as SongRequest;
        if (payload.eventType === "DELETE") {
          const oldRow = payload.old as SongRequest;
          setRequests((current) => current.filter((item) => item.id !== oldRow.id));
          return;
        }
        setRequests((current) => [next, ...current.filter((item) => item.id !== next.id)]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const grouped = useMemo(() => {
    return statuses.reduce((acc, status) => {
      acc[status] = requests.filter((request) => request.status === status);
      return acc;
    }, {} as Record<SongRequestStatus, SongRequest[]>);
  }, [requests]);

  async function setStatus(request: SongRequest, status: SongRequestStatus) {
    const next = { ...request, status, updated_at: new Date().toISOString() };
    const supabase = getSupabaseBrowserClient();
    try {
      if (supabase) {
        const { error } = await supabase.from("song_requests").update({ status, updated_at: next.updated_at }).eq("id", request.id);
        if (error) throw error;
      }
      setRequests((current) => current.map((item) => item.id === request.id ? next : item));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update request.");
    }
  }

  async function remove(request: SongRequest) {
    const supabase = getSupabaseBrowserClient();
    try {
      if (supabase) {
        const { error } = await supabase.from("song_requests").delete().eq("id", request.id);
        if (error) throw error;
      }
      setRequests((current) => current.filter((item) => item.id !== request.id));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete request.");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-black text-white"><ListMusic size={28} />Song Requests</h1>
        <p className="mt-1 text-sm text-muted">Realtime requests from guests.</p>
      </div>
      {message ? <p className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-muted">{message}</p> : null}
      <div className="grid gap-4 xl:grid-cols-4">
        {statuses.map((status) => (
          <section key={status} className="rounded-[24px] border border-line bg-surface p-3">
            <div className="mb-3 flex items-center justify-between">
              <StatusBadge status={status} />
              <span className="text-sm text-muted">{grouped[status]?.length || 0}</span>
            </div>
            <div className="space-y-3">
              {grouped[status]?.map((request) => (
                <article key={request.id} className="rounded-[20px] border border-line bg-night p-3">
                  <h3 className="font-semibold text-white">{request.song_title}</h3>
                  <p className="text-sm text-muted">{request.artist}</p>
                  <p className="mt-2 text-xs text-zinc-500">{request.guest_name} - {formatDateTime(request.created_at)}</p>
                  {request.note ? <p className="mt-2 text-xs text-zinc-400">{request.note}</p> : null}
                  {request.music_url ? <div className="mt-3"><MusicPreviewCard url={request.music_url} title={request.song_title} artist={request.artist} compact /></div> : null}
                  {request.music_url ? (
                    <a href={request.music_url} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-line bg-surface2 px-3 py-2 text-xs font-semibold text-white">
                      Open music link <ExternalLink size={13} />
                    </a>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => setStatus(request, "Approved")} className="rounded-xl border border-line p-2 text-blue-200" aria-label="Approve"><Check size={15} /></button>
                    <button onClick={() => setStatus(request, "Played")} className="rounded-xl border border-line p-2 text-emerald-200" aria-label="Mark as Played"><Play size={15} /></button>
                    <button onClick={() => setStatus(request, "Rejected")} className="rounded-xl border border-line p-2 text-rose-200" aria-label="Reject"><X size={15} /></button>
                    <button onClick={() => remove(request)} className="rounded-xl border border-rose-500/30 p-2 text-rose-200" aria-label="Delete"><Trash2 size={15} /></button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
