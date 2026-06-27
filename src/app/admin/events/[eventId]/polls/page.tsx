import { AdminPollManager } from "@/components/admin/admin-poll-manager";
import { getEventById } from "@/lib/data";

export default async function AdminPollsPage({ params }: { params: { eventId: string } }) {
  const bundle = await getEventById(params.eventId);
  return <AdminPollManager eventId={bundle.event.id} initialPolls={bundle.polls} initialOptions={bundle.pollOptions} initialVotes={bundle.pollVotes} />;
}
