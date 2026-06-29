import { notFound } from "next/navigation";
import { CrudManager, type CrudField } from "@/components/admin/crud-manager";
import { getEventById } from "@/lib/data";

const fields: CrudField[] = [
  { name: "event_id", label: "Event ID", type: "hidden" },
  { name: "name", label: "Name", required: true },
  { name: "category", label: "Category", type: "select", options: ["Cocktails", "Beer", "Shots", "Bottle Service", "Non-alcoholic", "Specials"] },
  { name: "description", label: "Description", type: "textarea" },
  { name: "price", label: "Price", type: "number" },
  { name: "image_url", label: "Image", type: "image" },
  { name: "promo_text", label: "Promo label" },
  { name: "is_available", label: "Available", type: "boolean" },
  { name: "display_order", label: "Display order", type: "number" }
];

export default async function AdminDrinksPage({ params }: { params: { eventId: string } }) {
  const bundle = await getEventById(params.eventId);
  if (!bundle) notFound();

  return <CrudManager title="Drinks Menu" description={bundle.event.name} table="drinks" fields={fields} initialRows={bundle.drinks as unknown as Record<string, unknown>[]} defaults={{ event_id: bundle.event.id, category: "Cocktails", is_available: true, display_order: 1 }} filter={{ column: "event_id", value: bundle.event.id }} />;
}
