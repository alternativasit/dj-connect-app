"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { EventRecord } from "@/lib/types";

async function getAdminToken() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

async function runEventMutation(input: { action: "update" | "delete"; id: string; payload?: Record<string, unknown> }) {
  const token = await getAdminToken();
  if (!token) throw new Error("Please log in again before saving.");

  const response = await fetch("/api/admin/crud", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      table: "events",
      action: input.action,
      id: input.id,
      payload: input.payload
    })
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Could not update event.");
  return result;
}

export function EventDetailActions({ event }: { event: EventRecord }) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<"finish" | "delete" | null>(null);
  const [message, setMessage] = useState("");

  async function finishEvent() {
    setPendingAction("finish");
    setMessage("");
    try {
      await runEventMutation({
        action: "update",
        id: event.id,
        payload: {
          status: "Finished",
          is_active: false,
          updated_at: new Date().toISOString()
        }
      });
      setMessage("Event finished successfully.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not finish event.");
    } finally {
      setPendingAction(null);
    }
  }

  async function deleteEvent() {
    const confirmed = window.confirm(`Delete "${event.name}"? This removes the event and its related requests, polls, drinks and promos.`);
    if (!confirmed) return;

    setPendingAction("delete");
    setMessage("");
    try {
      await runEventMutation({ action: "delete", id: event.id });
      router.push("/admin/events");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete event.");
      setPendingAction(null);
    }
  }

  const isFinished = event.status === "Finished";

  return (
    <div className="rounded-[24px] border border-line bg-surface/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Event actions</h2>
          <p className="mt-1 text-sm text-muted">Manage this event without leaving the detail page.</p>
        </div>
        <span className="rounded-full border border-line bg-night px-3 py-1 text-xs font-semibold text-white">{event.status}</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={finishEvent}
          disabled={Boolean(pendingAction) || isFinished}
          className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pendingAction === "finish" ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
          Finish event
        </button>
        <button
          type="button"
          onClick={deleteEvent}
          disabled={Boolean(pendingAction)}
          className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pendingAction === "delete" ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          Delete event
        </button>
        <Link href="/admin/events?new=1" className="gradient-button flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white">
          <Plus size={16} />
          Create event
        </Link>
      </div>

      {message ? <p className="mt-3 rounded-2xl border border-line bg-night px-4 py-3 text-sm text-muted">{message}</p> : null}
    </div>
  );
}
