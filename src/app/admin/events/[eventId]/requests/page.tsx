import { notFound } from "next/navigation";
import { AdminRequestsBoard } from "@/components/admin/admin-requests-board";
import { getAdminData, getEventById } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminRequestsPage({ params }: { params: { eventId: string } }) {
  const [bundle, adminData] = await Promise.all([
    getEventById(params.eventId),
    getAdminData()
  ]);
  if (!bundle) notFound();

  return <AdminRequestsBoard eventId={bundle.event.id} events={adminData.events} initialRequests={bundle.songRequests} />;
}
