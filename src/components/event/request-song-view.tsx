"use client";

import { useState } from "react";
import { DarkCard } from "@/components/ui/dark-card";
import { SongRequestForm } from "@/components/event/song-request-form";
import { SongRequestList } from "@/components/event/song-request-list";
import type { SongRequest } from "@/lib/types";

export function RequestSongView({ eventId, djId }: { eventId: string; djId: string }) {
  const [created, setCreated] = useState<SongRequest[]>([]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Request a Song</h2>
        <p className="mt-1 text-sm text-muted">Send a request straight to the DJ booth.</p>
      </div>
      <SongRequestForm eventId={eventId} djId={djId} onCreated={(request) => setCreated((current) => [request, ...current])} />
      <DarkCard>
        <h3 className="text-lg font-semibold text-white">My Requests</h3>
        <div className="mt-4">
          <SongRequestList eventId={eventId} requests={created} />
        </div>
      </DarkCard>
    </div>
  );
}
