import { CrudManager, type CrudField } from "@/components/admin/crud-manager";
import { getAdminData } from "@/lib/data";

const fields: CrudField[] = [
  { name: "dj_id", label: "DJ ID", required: true },
  { name: "event_id", label: "Event ID" },
  { name: "media_url", label: "Media", type: "image", required: true },
  { name: "media_type", label: "Media type", type: "select", options: ["image", "video"] },
  { name: "caption", label: "Caption" },
  { name: "display_order", label: "Display order", type: "number" }
];

export default async function AdminGalleryPage() {
  const data = await getAdminData();
  return <CrudManager title="Gallery" description="Manage DJ and event media." table="gallery_items" fields={fields} initialRows={data.gallery as unknown as Record<string, unknown>[]} defaults={{ media_type: "image", display_order: 1 }} />;
}
