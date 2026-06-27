"use client";

import { useEffect, useState } from "react";

import { StatusBadge } from "@/components/ui/status-badge";
import type { EventStatus } from "@/lib/types";

export function EventStatusLiveBadge({ eventId, initialStatus }: { eventId?: string; initialStatus: EventStatus }) {
  const [status, setStatus] = useState<EventStatus>(initialStatus);

  useEffect(() => {
    if (!eventId) return;
    let active = true;

    async function loadStatus() {
      try {
        const response = await fetch("/api/events/" + eventId + "/status", { cache: "no-store" });
        const result = await response.json().catch(() => null);
        const nextStatus = result?.event?.status as EventStatus | undefined;
        if (active && nextStatus) setStatus(nextStatus);
      } catch {
        // Keep the last known status when the network is unavailable.
      }
    }

    loadStatus();
    const timer = window.setInterval(loadStatus, 8000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [eventId]);

  return <StatusBadge status={status === "Live" ? "LIVE" : status} />;
}
