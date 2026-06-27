import { AppShell } from "@/components/event/app-shell";
import { RequestSongView } from "@/components/event/request-song-view";
import { getEventBundle } from "@/lib/data";

export default async function RequestSongPage({ params }: { params: { eventSlug: string } }) {
  const bundle = await getEventBundle(params.eventSlug);
  return (
    <AppShell eventSlug={bundle.event.slug} title="Request a Song" subtitle={bundle.event.name}>
      <RequestSongView eventId={bundle.event.id} djId={bundle.dj.id} />
    </AppShell>
  );
}
