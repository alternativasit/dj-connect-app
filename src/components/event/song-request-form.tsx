"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { songRequestSchema } from "@/lib/validations";
import { getGuestSessionId, storeRequest } from "@/lib/guest-session";
import type { SongRequest } from "@/lib/types";

type FormState = {
  guest_name: string;
  song_title: string;
  artist: string;
  note: string;
};

const emptyForm: FormState = {
  guest_name: "",
  song_title: "",
  artist: "",
  note: ""
};

export function SongRequestForm({ eventId, djId, onCreated }: { eventId: string; djId: string; onCreated?: (request: SongRequest) => void }) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setStatusMessage("");
    const parsed = songRequestSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        nextErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    setStatus("saving");
    const payload = {
      event_id: eventId,
      dj_id: djId,
      guest_name: parsed.data.guest_name,
      song_title: parsed.data.song_title,
      artist: parsed.data.artist,
      note: parsed.data.note || null,
      guest_session_id: getGuestSessionId()
    };

    try {
      const response = await fetch("/api/song-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Could not send your request. Try again.");
      }

      const saved = result.songRequest as SongRequest;
      storeRequest(saved);
      onCreated?.(saved);
      setForm(emptyForm);
      setStatus("success");
      setStatusMessage("Your request was sent to the DJ.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Could not send your request. Try again.");
    }
  }

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[24px] border border-line bg-surface p-4">
      <div>
        <label className="text-sm font-medium text-white" htmlFor="guest_name">Guest name</label>
        <input
          id="guest_name"
          value={form.guest_name}
          onChange={(event) => updateField("guest_name", event.target.value)}
          className="mt-2 w-full rounded-2xl border border-line bg-night px-4 py-3 text-white outline-none focus:border-violet"
          placeholder="Your name"
        />
        {errors.guest_name ? <p className="mt-1 text-xs text-rose-300">{errors.guest_name}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-white" htmlFor="song_title">Song title</label>
          <input
            id="song_title"
            value={form.song_title}
            onChange={(event) => updateField("song_title", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-night px-4 py-3 text-white outline-none focus:border-violet"
            placeholder="One More Time"
          />
          {errors.song_title ? <p className="mt-1 text-xs text-rose-300">{errors.song_title}</p> : null}
        </div>
        <div>
          <label className="text-sm font-medium text-white" htmlFor="artist">Artist</label>
          <input
            id="artist"
            value={form.artist}
            onChange={(event) => updateField("artist", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-night px-4 py-3 text-white outline-none focus:border-violet"
            placeholder="Daft Punk"
          />
          {errors.artist ? <p className="mt-1 text-xs text-rose-300">{errors.artist}</p> : null}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-white" htmlFor="note">Optional note</label>
        <textarea
          id="note"
          value={form.note}
          onChange={(event) => updateField("note", event.target.value)}
          className="mt-2 min-h-24 w-full rounded-2xl border border-line bg-night px-4 py-3 text-white outline-none focus:border-violet"
          placeholder="Birthday table, dedication, vibe..."
        />
      </div>
      <button
        type="submit"
        disabled={status === "saving"}
        className="gradient-button flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        <Send size={18} />
        {status === "saving" ? "Sending" : "Send Request"}
      </button>
      {status === "success" ? <p className="text-center text-sm text-emerald-300">{statusMessage}</p> : null}
      {status === "error" ? <p className="text-center text-sm text-rose-300">{statusMessage || "Could not send your request. Try again."}</p> : null}
    </form>
  );
}
