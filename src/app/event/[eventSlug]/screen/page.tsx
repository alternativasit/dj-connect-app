import { notFound } from "next/navigation";
import { ScreenModeLayout } from "@/components/event/screen-mode-layout";
import { getEventBundle } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ScreenModePage({ params, searchParams }: { params: { eventSlug: string }; searchParams?: { preview?: string } }) {
  const bundle = await getEventBundle(params.eventSlug, { includeInactive: searchParams?.preview === "admin" });
  if (!bundle) notFound();

  return <ScreenModeLayout bundle={bundle} />;
}
