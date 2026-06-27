"use client";

import { useEffect, useMemo, useState } from "react";
import { Radio } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { pollCreateSchema } from "@/lib/validations";
import { createClientId } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Poll, PollOption, PollType, PollVote } from "@/lib/types";

export function AdminPollManager({ eventId, initialPolls, initialOptions, initialVotes }: { eventId: string; initialPolls: Poll[]; initialOptions: PollOption[]; initialVotes: PollVote[] }) {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [options, setOptions] = useState<PollOption[]>(initialOptions);
  const [votes, setVotes] = useState<PollVote[]>(initialVotes);
  const [form, setForm] = useState({ question: "", type: "genre" as PollType, options: "Reggaeton\nHouse\nPop\nHip-Hop", is_active: true, starts_at: "", ends_at: "" });
  const [message, setMessage] = useState("");

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

  async function createPoll(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = pollCreateSchema.safeParse(form);
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message || "Check poll fields.");
      return;
    }

    const poll: Poll = {
      id: createClientId("poll"),
      event_id: eventId,
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
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { error: pollError } = await supabase.from("polls").insert(poll);
        if (pollError) throw pollError;
        const { error: optionError } = await supabase.from("poll_options").insert(nextOptions);
        if (optionError) throw optionError;
      }
      setPolls((current) => [poll, ...current]);
      setOptions((current) => [...nextOptions, ...current]);
      setForm({ ...form, question: "" });
      setMessage("Poll created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create poll.");
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
        <p className="mt-1 text-sm text-muted">Create active polls and watch results update.</p>
      </div>
      <form onSubmit={createPoll} className="grid gap-4 rounded-[24px] border border-line bg-surface p-4 md:grid-cols-2">
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
        {polls.map((poll) => {
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
        })}
      </div>
    </div>
  );
}
