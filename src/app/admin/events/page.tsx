import Link from "next/link";
import { CrudManager, type CrudField, type CrudOption } from "@/components/admin/crud-manager";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAdminData } from "@/lib/data";
import { formatEventDate } from "@/lib/utils";
import type { DJ, EventRecord, EventStatus, Venue } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function toOptions(items: { id: string; name: string }[], emptyLabel?: string): CrudOption[] {
  const options: CrudOption[] = items.map((item) => ({ label: item.name, value: item.id }));
  return emptyLabel ? [{ label: emptyLabel, value: "" }, ...options] : options;
}

function uniqueOptions(values: Array<string | null | undefined>, fallback: string[]) {
  return Array.from(new Set([...values.filter(Boolean).map(String), ...fallback])).filter(Boolean);
}

function EventDirectory({ events, djs, venues }: { events: EventRecord[]; djs: DJ[]; venues: Venue[] }) {
  const groups: Array<{ label: string; status: EventStatus; help: string }> = [
    { label: "Live events", status: "Live", help: "Events visible as live experiences." },
    { label: "Draft events", status: "Draft", help: "Events being prepared before launch." },
    { label: "Finished events", status: "Finished", help: "Past or closed events." }
  ];

  const djName = (id: string) => djs.find((dj) => dj.id === id)?.name || "No DJ";
  const venueName = (id: string | null) => venues.find((venue) => venue.id === id)?.name || "No venue";

  return (
    <section className="rounded-[24px] border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">Event Overview</h2>
          <p className="mt-1 text-sm text-muted">Live, draft and finished events at a glance.</p>
        </div>
        <span className="rounded-full border border-line bg-night px-3 py-1 text-xs font-semibold text-white">{events.length} events</span>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {groups.map((group) => {
          const groupEvents = events.filter((event) => event.status === group.status);
          return (
            <div key={group.status} className="rounded-[20px] border border-line bg-night p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">{group.label}</h3>
                  <p className="mt-1 text-xs text-muted">{group.help}</p>
                </div>
                <span className="rounded-full border border-line px-2 py-1 text-xs text-zinc-300">{groupEvents.length}</span>
              </div>
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1 soft-scrollbar">
                {groupEvents.length ? groupEvents.map((event) => (
                  <Link key={event.id} href={`/admin/events/${event.id}`} className="block rounded-2xl border border-line bg-black px-4 py-3 transition hover:border-violet/60">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{event.name}</p>
                        <p className="mt-1 text-xs text-muted">{formatEventDate(event.event_date)} - {event.city || venueName(event.venue_id)}</p>
                        <p className="mt-1 text-xs text-zinc-500">{djName(event.dj_id)} at {venueName(event.venue_id)}</p>
                      </div>
                      <StatusBadge status={event.status === "Live" ? "LIVE" : event.status} />
                    </div>
                  </Link>
                )) : (
                  <p className="rounded-2xl border border-line bg-black px-4 py-3 text-sm text-muted">No {group.status.toLowerCase()} events yet.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default async function AdminEventsPage() {
  const data = await getAdminData();
  const djOptions = toOptions(data.djs, "Select DJ");
  const venueOptions = toOptions(data.venues, "No venue selected");
  const defaultDjId = data.djs[0]?.id || "";
  const defaultVenueId = data.venues[0]?.id || "";
  const cityOptions = uniqueOptions([...data.events.map((event) => event.city), ...data.venues.map((venue) => venue.city)], ["Mexico City", "Guadalajara", "Monterrey", "New York", "Los Angeles", "Miami", "Las Vegas"]);

  const fields: CrudField[] = [
    { name: "name", label: "Event name", required: true, description: "Public title shown on the guest app and QR screen.", placeholder: "Sunset Rooftop Party" },
    { name: "slug", label: "Slug", type: "hidden" },
    { name: "dj_id", label: "DJ", type: "select", options: djOptions, sourceTable: "djs", optionLabel: "name", emptyLabel: "Select DJ", required: true, description: "Choose the DJ assigned to this event." },
    { name: "venue_id", label: "Venue", type: "select", options: venueOptions, sourceTable: "venues", optionLabel: "name", emptyLabel: "No venue selected", description: "Choose the venue or business hosting this event." },
    { name: "description", label: "Description", type: "textarea", description: "Short event description for guests.", placeholder: "Rooftop party with house, tech house and open format music." },
    { name: "event_date", label: "Event date", type: "date", description: "Date when the event happens." },
    { name: "start_time", label: "Start time", type: "time", description: "When guests can start interacting with the DJ." },
    { name: "end_time", label: "End time", type: "time", description: "Optional end time." },
    { name: "city", label: "City", type: "combobox", options: cityOptions, description: "Choose a suggested city or type a new one.", placeholder: "Mexico City" },
    { name: "address", label: "Address", description: "Venue address, room name or short location reference.", placeholder: "Rooftop Lounge" },
    { name: "banner_url", label: "Event banner URL", type: "image", description: "Main image shown on the guest event page.", placeholder: "https://..." },
    { name: "status", label: "Status", type: "select", options: ["Draft", "Live", "Finished"], description: "Use Live when guests should see this as an active event." },
    { name: "is_active", label: "Active event page", type: "boolean", description: "Turn this off to hide the public event page." }
  ];

  return (
    <div className="space-y-7">
      <EventDirectory events={data.events} djs={data.djs} venues={data.venues} />
      <CrudManager
        title="Events"
        description="Create event pages. The public slug and QR link are generated automatically."
        table="events"
        fields={fields}
        initialRows={data.events as unknown as Record<string, unknown>[]}
        defaults={{ status: "Draft", is_active: true, dj_id: defaultDjId, venue_id: defaultVenueId }}
      />
    </div>
  );
}
