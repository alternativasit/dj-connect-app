import { CrudManager, type CrudField } from "@/components/admin/crud-manager";
import { getAdminData } from "@/lib/data";

const fields: CrudField[] = [
  { name: "name", label: "Name", required: true },
  { name: "slug", label: "Slug", required: true },
  { name: "dj_id", label: "DJ ID", required: true },
  { name: "venue_id", label: "Venue ID" },
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

export default async function AdminEventsPage() {
  const data = await getAdminData();
  return <CrudManager title="Events" description="Create event slugs and QR-ready public pages." table="events" fields={fields} initialRows={data.events as unknown as Record<string, unknown>[]} defaults={{ status: "Draft", is_active: true }} />;
}

