import { AppShell } from "@/components/event/app-shell";
import { PollCard } from "@/components/event/poll-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getEventBundle } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PollsPage({ params }: { params: { eventSlug: string } }) {
  const bundle = await getEventBundle(params.eventSlug);
  return (
    <AppShell eventSlug={bundle.event.slug} eventId={bundle.event.id} title="Live Polls" subtitle={bundle.event.name} status={bundle.event.status}>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Polls</h2>
          <p className="mt-1 text-sm text-muted">Vote once per poll and watch live results update.</p>
        </div>
        {bundle.polls.length ? bundle.polls.map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            options={bundle.pollOptions.filter((option) => option.poll_id === poll.id)}
            initialVotes={bundle.pollVotes.filter((vote) => vote.poll_id === poll.id)}
          />
        )) : <EmptyState title="No active polls" text="Check back when the DJ opens a new vote." />}
      </div>
    </AppShell>
  );
}



