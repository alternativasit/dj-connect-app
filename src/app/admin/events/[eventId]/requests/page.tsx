import { AdminRequestsBoard } from "@/components/admin/admin-requests-board";
import { getEventById } from "@/lib/data";

export default async function AdminRequestsPage({ params }: { params: { eventId: string } }) {
  const bundle = await getEventById(params.eventId);
  return <AdminRequestsBoard eventId={bundle.event.id} initialRequests={bundle.songRequests} />;
}
