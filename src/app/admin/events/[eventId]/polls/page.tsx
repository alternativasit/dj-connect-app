import { AdminPollManager } from "@/components/admin/admin-poll-manager";
import { getAdminData, getEventById } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPollsPage({ params }: { params: { eventId: string } }) {
  const [bundle, adminData] = await Promise.all([getEventById(params.eventId), getAdminData()]);
  return (
    <AdminPollManager
      eventId={bundle.event.id}
      events={adminData.events}
      initialPolls={bundle.polls}
      initialOptions={bundle.pollOptions}
      initialVotes={bundle.pollVotes}
    />
  );
}
