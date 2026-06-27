import { AppShell } from "@/components/event/app-shell";
import { PromoCard } from "@/components/event/promo-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getEventBundle } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PromosPage({ params }: { params: { eventSlug: string } }) {
  const bundle = await getEventBundle(params.eventSlug);
  return (
    <AppShell eventSlug={bundle.event.slug} eventId={bundle.event.id} title="Event Promos" subtitle={bundle.event.name} status={bundle.event.status}>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-white">Event Promos</h2>
          <p className="mt-1 text-sm text-muted">Active offers from the venue, sponsors and DJ.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bundle.promos.length ? bundle.promos.map((promo) => <PromoCard key={promo.id} promo={promo} />) : <EmptyState title="No active promos" />}
        </div>
      </div>
    </AppShell>
  );
}



