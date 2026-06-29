import { notFound } from "next/navigation";
import { CrudManager, type CrudField } from "@/components/admin/crud-manager";
import { getEventById } from "@/lib/data";

const fields: CrudField[] = [
  { name: "event_id", label: "Event ID", type: "hidden" },
  { name: "title", label: "Title", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "image_url", label: "Image", type: "image" },
  { name: "sponsor_name", label: "Sponsor / venue name" },
  { name: "valid_until", label: "Valid until" },
  { name: "is_active", label: "Active", type: "boolean" },
  { name: "display_order", label: "Display order", type: "number" }
];

export default async function AdminPromosPage({ params }: { params: { eventId: string } }) {
  const bundle = await getEventById(params.eventId);
  if (!bundle) notFound();

  return <CrudManager title="Event Promos" description={bundle.event.name} table="promos" fields={fields} initialRows={bundle.promos as unknown as Record<string, unknown>[]} defaults={{ event_id: bundle.event.id, is_active: true, display_order: 1 }} filter={{ column: "event_id", value: bundle.event.id }} />;
}
