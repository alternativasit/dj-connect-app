import { CrudManager, type CrudField, type CrudOption } from "@/components/admin/crud-manager";
import { getAdminData } from "@/lib/data";

function toOptions(items: { id: string; name: string }[], emptyLabel?: string): CrudOption[] {
  const options: CrudOption[] = items.map((item) => ({ label: item.name, value: item.id }));
  return emptyLabel ? [{ label: emptyLabel, value: "" }, ...options] : options;
}

export default async function AdminEventsPage() {
  const data = await getAdminData();
  const djOptions = toOptions(data.djs, "Select DJ");
  const venueOptions = toOptions(data.venues, "No venue selected");
  const defaultDjId = data.djs[0]?.id || "";
  const defaultVenueId = data.venues[0]?.id || "";

  const fields: CrudField[] = [
    { name: "name", label: "Name", required: true },
    { name: "slug", label: "Slug", type: "hidden" },
    { name: "dj_id", label: "DJ", type: "select", options: djOptions, required: true },
    { name: "venue_id", label: "Venue", type: "select", options: venueOptions },
    { name: "description", label: "Description", type: "textarea" },
    { name: "event_date", label: "Event date", type: "date" },
    { name: "start_time", label: "Start time", type: "time" },
    { name: "end_time", label: "End time", type: "time" },
    { name: "city", label: "City" },
    { name: "address", label: "Address" },
    { name: "banner_url", label: "Banner", type: "image" },
    { name: "status", label: "Status", type: "select", options: ["Draft", "Live", "Finished"] },
    { name: "is_active", label: "Is active", type: "boolean" }
  ];

  return (
    <CrudManager
      title="Events"
      description="Create event pages. The public slug and QR link are generated automatically."
      table="events"
      fields={fields}
      initialRows={data.events as unknown as Record<string, unknown>[]}
      defaults={{ status: "Draft", is_active: true, dj_id: defaultDjId, venue_id: defaultVenueId }}
    />
  );
}