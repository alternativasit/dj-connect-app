"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2 } from "lucide-react";
import { DarkCard } from "@/components/ui/dark-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { countdownLabel, createClientId } from "@/lib/utils";
import { getGuestSessionId, hasVoted, markVoted } from "@/lib/guest-session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Poll, PollOption, PollVote } from "@/lib/types";

export function PollCard({ poll, options, initialVotes }: { poll: Poll; options: PollOption[]; initialVotes: PollVote[] }) {
  const [votes, setVotes] = useState<PollVote[]>(initialVotes);
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setSelected(hasVoted(poll.id) ? "voted" : null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel("poll-votes-" + poll.id)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "poll_votes", filter: "poll_id=eq." + poll.id },
        (payload) => {
          const next = payload.new as PollVote;
          setVotes((current) => current.some((item) => item.id === next.id) ? current : [...current, next]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [poll.id]);

  const summary = useMemo(() => {
    const total = votes.length;
    return options
      .map((option) => {
        const count = votes.filter((vote) => vote.option_id === option.id).length;
        return {
          option,
          count,
          percentage: total ? Math.round((count / total) * 100) : 0
        };
      })
      .sort((a, b) => b.count - a.count || a.option.display_order - b.option.display_order);
  }, [options, votes]);

  async function vote(optionId: string) {
    if (selected || hasVoted(poll.id)) {
      setMessage("You already voted in this poll.");
      return;
    }

    const guestSessionId = getGuestSessionId();
    const newVote: PollVote = {
      id: createClientId("poll-vote"),
      poll_id: poll.id,
      option_id: optionId,
      guest_session_id: guestSessionId,
      created_at: new Date().toISOString()
    };

    try {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { error } = await supabase.from("poll_votes").insert(newVote);
        if (error) throw error;
      }
      markVoted(poll.id, optionId);
      setSelected(optionId);
      setVotes((current) => [...current, newVote]);
      setMessage("Vote counted.");
    } catch {
      setMessage("Could not save your vote. You may have already voted.");
    }
  }

  return (
    <DarkCard className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-violet"><BarChart3 size={14} />Live Polls</p>
          <h3 className="mt-2 text-xl font-bold text-white">{poll.question}</h3>
          <p className="mt-1 text-sm text-muted">{poll.type === "genre" ? "Genre Poll" : poll.type === "song" ? "Song Poll" : "Custom Poll"}</p>
        </div>
        <span className="rounded-full border border-line px-2 py-1 text-xs text-zinc-300">{countdownLabel(poll.ends_at)}</span>
      </div>

      <div className="space-y-3">
        {summary.map(({ option, count, percentage }, index) => {
          const votedForThis = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => vote(option.id)}
              className="w-full rounded-[20px] border border-line bg-night p-3 text-left transition hover:border-violet/70 disabled:cursor-default"
              disabled={Boolean(selected)}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface2 text-xs text-muted">{index + 1}</span>
                  {option.label}
                  {votedForThis ? <CheckCircle2 size={16} className="text-emerald-300" /> : null}
                </span>
                <span className="text-xs text-muted">{percentage}% · {count} votes</span>
              </div>
              <ProgressBar value={percentage} />
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-line bg-surface2 px-3 py-2 text-sm text-muted">
        <span>Total votes</span>
        <strong className="text-white">{votes.length}</strong>
      </div>
      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </DarkCard>
  );
}
