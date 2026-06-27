import { AppShell } from "@/components/event/app-shell";
import { DrinksMenu } from "@/components/event/drinks-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { getEventBundle } from "@/lib/data";

export default async function DrinksPage({ params }: { params: { eventSlug: string } }) {
  const bundle = await getEventBundle(params.eventSlug);
  return (
    <AppShell eventSlug={bundle.event.slug} title="Drinks Menu" subtitle={bundle.venue?.name || bundle.event.name}>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-white">Drinks Menu</h2>
          <p className="mt-1 text-sm text-muted">Cocktails, beer, shots, bottle service and specials.</p>
        </div>
        {bundle.drinks.length ? <DrinksMenu drinks={bundle.drinks} /> : <EmptyState title="No drinks available" />}
      </div>
    </AppShell>
  );
}
