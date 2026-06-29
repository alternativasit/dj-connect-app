import { notFound } from "next/navigation";
import { AppShell } from "@/components/event/app-shell";
import { RequestSongView } from "@/components/event/request-song-view";
import { getEventBundle } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RequestSongPage({ params, searchParams }: { params: { eventSlug: string }; searchParams?: { preview?: string } }) {
  const isAdminPreview = searchParams?.preview === "admin";
  const bundle = await getEventBundle(params.eventSlug, { includeInactive: isAdminPreview });
  if (!bundle) notFound();

  return (
    <AppShell eventSlug={bundle.event.slug} eventId={bundle.event.id} title="Request a Song" subtitle={bundle.event.name} status={bundle.event.status} previewMode={isAdminPreview}>
      <RequestSongView eventId={bundle.event.id} djId={bundle.dj.id} />
    </AppShell>
  );
}
