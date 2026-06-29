import { notFound } from "next/navigation";
import { AppShell } from "@/components/event/app-shell";
import { TipPanel } from "@/components/event/tip-panel";
import { getEventBundle } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TipPage({ params, searchParams }: { params: { eventSlug: string }; searchParams?: { preview?: string } }) {
  const isAdminPreview = searchParams?.preview === "admin";
  const bundle = await getEventBundle(params.eventSlug, { includeInactive: isAdminPreview });
  if (!bundle) notFound();

  return (
    <AppShell eventSlug={bundle.event.slug} eventId={bundle.event.id} title="Tip the DJ" subtitle={bundle.dj.name} status={bundle.event.status} previewMode={isAdminPreview}>
      <TipPanel dj={bundle.dj} event={bundle.event} />
    </AppShell>
  );
}
