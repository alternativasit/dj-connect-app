import { AppShell } from "@/components/event/app-shell";
import { TipPanel } from "@/components/event/tip-panel";
import { getEventBundle } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TipPage({ params }: { params: { eventSlug: string } }) {
  const bundle = await getEventBundle(params.eventSlug);
  return (
    <AppShell eventSlug={bundle.event.slug} eventId={bundle.event.id} title="Tip the DJ" subtitle={bundle.dj.name} status={bundle.event.status}>
      <TipPanel dj={bundle.dj} event={bundle.event} />
    </AppShell>
  );
}



