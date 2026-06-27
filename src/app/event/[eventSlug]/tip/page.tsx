import { AppShell } from "@/components/event/app-shell";
import { TipPanel } from "@/components/event/tip-panel";
import { getEventBundle } from "@/lib/data";

export default async function TipPage({ params }: { params: { eventSlug: string } }) {
  const bundle = await getEventBundle(params.eventSlug);
  return (
    <AppShell eventSlug={bundle.event.slug} title="Tip the DJ" subtitle={bundle.dj.name}>
      <TipPanel dj={bundle.dj} event={bundle.event} />
    </AppShell>
  );
}
