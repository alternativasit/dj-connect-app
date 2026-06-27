import { ScreenModeLayout } from "@/components/event/screen-mode-layout";
import { getEventBundle } from "@/lib/data";

export default async function ScreenModePage({ params }: { params: { eventSlug: string } }) {
  const bundle = await getEventBundle(params.eventSlug);
  return <ScreenModeLayout bundle={bundle} />;
}
