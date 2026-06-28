"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Radio, Square, Trash2 } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { pollCreateSchema } from "@/lib/validations";
import { createClientId, formatEventDate } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { EventRecord, Poll, PollOption, PollType, PollVote } from "@/lib/types";

export function AdminPollManager({
  eventId,
  events,
  initialPolls,
  initialOptions,
  initialVotes
}: {
  eventId: string;
  events: EventRecord[];
  initialPolls: Poll[];
  initialOptions: PollOption[];
  initialVotes: PollVote[];
}) {
  const router = useRouter();
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [options, setOptions] = useState<PollOption[]>(initialOptions);
  const [votes, setVotes] = useState<PollVote[]>(initialVotes);
  const [selectedEventId, setSelectedEventId] = useState(eventId);
  const [form, setForm] = useState({ question: "", type: "genre" as PollType, options: "Reggaeton\nHouse\nPop\nHip-Hop", is_active: true, starts_at: "", ends_at: "" });
  const [message, setMessage] = useState("");

  const selectedEvent = useMemo(() => events.find((event) => event.id === selectedEventId), [events, selectedEventId]);
  const activePolls = useMemo(() => polls.filter((poll) => poll.is_active), [polls]);

  useEffect(() => {
    setSelectedEventId(eventId);
    setPolls(initialPolls);
    setOptions(initialOptions);
    setVotes(initialVotes);
    setMessage("");
  }, [eventId, initialOptions, initialPolls, initialVotes]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const channel = supabase
      .channel("admin-poll-votes-" + eventId)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "poll_votes" }, (payload) => {
        const next = payload.new as PollVote;
        if (!polls.some((poll) => poll.id === next.poll_id)) return;
        setVotes((current) => current.some((vote) => vote.id === next.id) ? current : [...current, next]);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, polls]);

  async function getAdminToken() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  }

  async function runAdminMutation(input: { table: string; action: "insert" | "update" | "delete"; id?: string; payload?: Record<string, unknown> }) {
    const token = await getAdminToken();
    if (!token) throw new Error("Please log in again before creating a poll.");
    const response = await fetch("/api/admin/crud", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(input)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Could not save poll.");
    return result as { ok: boolean; row?: Record<string, unknown> };
  }

  async function createPoll(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const parsed = pollCreateSchema.safeParse(form);
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message || "Check poll fields.");
      return;
    }

    const poll: Poll = {
      id: createClientId("poll"),
      event_id: selectedEventId,
      question: parsed.data.question,
      type: parsed.data.type,
      is_active: parsed.data.is_active,
      starts_at: parsed.data.starts_at || null,
      ends_at: parsed.data.ends_at || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const nextOptions = parsed.data.options.split("\n").map((label, index) => ({
      id: createClientId("poll-option"),
      poll_id: poll.id,
      label: label.trim(),
      image_url: null,
      display_order: index + 1,
      created_at: new Date().toISOString()
    })).filter((option) => option.label) as PollOption[];

    try {
      const pollResult = await runAdminMutation({ table: "polls", action: "insert", payload: poll as unknown as Record<string, unknown> });
      const savedPoll = (pollResult.row || poll) as unknown as Poll;
      const savedOptions = await Promise.all(
        nextOptions.map(async (option) => {
          const optionResult = await runAdminMutation({ table: "poll_options", action: "insert", payload: option as unknown as Record<string, unknown> });
          return (optionResult.row || option) as unknown as PollOption;
        })
      );
      setPolls((current) => [savedPoll, ...current]);
      setOptions((current) => [...savedOptions, ...current]);
      setForm({ ...form, question: "" });
      setMessage(`Poll created in ${selectedEvent?.name || "selected event"}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create poll.");
    }
  }

  async function endPoll(poll: Poll) {
    setMessage("");
    const nextPoll: Poll = { ...poll, is_active: false, updated_at: new Date().toISOString() };
    try {
      const result = await runAdminMutation({ table: "polls", action: "update", id: poll.id, payload: nextPoll as unknown as Record<string, unknown> });
      const savedPoll = (result.row || nextPoll) as unknown as Poll;
      setPolls((current) => current.map((item) => item.id === poll.id ? savedPoll : item));
      setMessage("Poll ended. It is no longer visible to guests.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not end poll.");
    }
  }

  async function deletePoll(poll: Poll) {
    if (!window.confirm("Delete this poll and its votes?")) return;
    setMessage("");
    try {
      await runAdminMutation({ table: "polls", action: "delete", id: poll.id });
      setPolls((current) => current.filter((item) => item.id !== poll.id));
      setOptions((current) => current.filter((option) => option.poll_id !== poll.id));
      setVotes((current) => current.filter((vote) => vote.poll_id !== poll.id));
      setMessage("Poll deleted successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete poll.");
    }
  }

  function resultFor(poll: Poll) {
    const pollOptions = options.filter((option) => option.poll_id === poll.id).sort((a, b) => a.display_order - b.display_order);
    const pollVotes = votes.filter((vote) => vote.poll_id === poll.id);
    return { pollOptions, pollVotes, total: pollVotes.length };
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-black text-white"><Radio size={28} />Live Polls</h1>
        <p className="mt-1 text-sm text-muted">Create active polls and choose the event where guests will see them.</p>
      </div>
      <form onSubmit={createPoll} className="grid gap-4 rounded-[24px] border border-line bg-surface p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Publish to event</label>
          <p className="mt-1 text-xs text-muted">Choose the event where this Live Poll will appear for guests.</p>
          <select
            value={selectedEventId}
            onChange={(event) => {
              const nextEventId = event.target.value;
              setSelectedEventId(nextEventId);
              router.push("/admin/events/" + nextEventId + "/polls");
            }}
            className="mt-2 w-full rounded-2xl border border-line bg-night px-4 py-3 outline-none focus:border-violet"
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} - {event.status} - {formatEventDate(event.event_date)}
              </option>
            ))}
          </select>
          {selectedEvent ? <p className="mt-2 text-xs text-zinc-500">Current event: {selectedEvent.name}</p> : null}
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Question</label>
          <input value={form.question} onChange={(event) => setForm({ ...form, question: event.target.value })} className="mt-2 w-full rounded-2xl border border-line bg-night px-4 py-3 outline-none focus:border-violet" />
        </div>
        <div>
          <label className="text-sm font-medium">Type</label>
          <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as PollType })} className="mt-2 w-full rounded-2xl border border-line bg-night px-4 py-3 outline-none focus:border-violet">
            <option value="genre">genre</option>
            <option value="song">song</option>
            <option value="custom">custom</option>
          </select>
        </div>
        <label className="flex items-center gap-3 rounded-2xl border border-line bg-night px-4 py-3 text-sm"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />Is active</label>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Options</label>
          <textarea value={form.options} onChange={(event) => setForm({ ...form, options: event.target.value })} className="mt-2 min-h-28 w-full rounded-2xl border border-line bg-night px-4 py-3 outline-none focus:border-violet" />
        </div>
        <button className="gradient-button rounded-2xl px-4 py-3 font-semibold md:col-span-2">Create Poll</button>
      </form>
      {message ? <p className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-muted">{message}</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {activePolls.length ? activePolls.map((poll) => {
          const result = resultFor(poll);
          return (
            <article key={poll.id} className="rounded-[24px] border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{poll.question}</h3>
                  <p className="text-sm text-muted">{poll.type} · {poll.is_active ? "Active" : "Paused"}</p>
                </div>
                <span className="rounded-full border border-line px-2 py-1 text-xs text-zinc-300">{result.total} votes</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => endPoll(poll)} className="inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-100">
                  <Square size={13} /> End poll
                </button>
                <button type="button" onClick={() => deletePoll(poll)} className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-100">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {result.pollOptions.map((option) => {
                  const count = result.pollVotes.filter((vote) => vote.option_id === option.id).length;
                  const percentage = result.total ? Math.round((count / result.total) * 100) : 0;
                  return (
                    <div key={option.id}>
                      <div className="mb-1 flex justify-between text-sm"><span>{option.label}</span><span className="text-muted">{count} · {percentage}%</span></div>
                      <ProgressBar value={percentage} />
                    </div>
                  );
                })}
              </div>
            </article>
          );
        }) : (
          <p className="rounded-[24px] border border-line bg-surface p-5 text-sm text-muted lg:col-span-2">No active polls for this event yet.</p>
        )}
      </div>
    </div>
  );
}
