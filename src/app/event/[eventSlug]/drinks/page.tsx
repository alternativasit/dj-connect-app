import { notFound } from "next/navigation";
import { AppShell } from "@/components/event/app-shell";
import { DrinksMenu } from "@/components/event/drinks-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { getEventBundle } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DrinksPage({ params, searchParams }: { params: { eventSlug: string }; searchParams?: { preview?: string } }) {
  const isAdminPreview = searchParams?.preview === "admin";
  const bundle = await getEventBundle(params.eventSlug, { includeInactive: isAdminPreview });
  if (!bundle) notFound();

  return (
    <AppShell eventSlug={bundle.event.slug} eventId={bundle.event.id} title="Drinks Menu" subtitle={bundle.venue?.name || bundle.event.name} status={bundle.event.status} previewMode={isAdminPreview}>
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
