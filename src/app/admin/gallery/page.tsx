import { CrudManager, type CrudField, type CrudOption } from "@/components/admin/crud-manager";
import { getAdminData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function toOptions(items: { id: string; name: string }[], emptyLabel?: string): CrudOption[] {
  const options: CrudOption[] = items.map((item) => ({ label: item.name, value: item.id }));
  return emptyLabel ? [{ label: emptyLabel, value: "" }, ...options] : options;
}

export default async function AdminGalleryPage() {
  const data = await getAdminData();
  const djOptions = toOptions(data.djs, "Select DJ");
  const eventOptions = toOptions(data.events, "No event selected");

  const fields: CrudField[] = [
    {
      name: "dj_id",
      label: "DJ",
      type: "select",
      options: djOptions,
      sourceTable: "djs",
      optionLabel: "name",
      emptyLabel: "Select DJ",
      required: true,
      description: "Choose the DJ this photo or video belongs to."
    },
    {
      name: "event_id",
      label: "Event",
      type: "select",
      options: eventOptions,
      sourceTable: "events",
      optionLabel: "name",
      emptyLabel: "No event selected",
      description: "Optional. Choose an event if this media belongs to a specific party."
    },
    { name: "media_url", label: "Media URL", type: "image", required: true, description: "Paste the image or video URL that should appear in the gallery.", placeholder: "https://..." },
    { name: "media_type", label: "Media type", type: "select", options: ["image", "video"], description: "Choose image for photos or video for video links." },
    { name: "caption", label: "Caption", description: "Short text shown below the media.", placeholder: "Rooftop crowd, main stage, aftermovie..." },
    { name: "display_order", label: "Display order", type: "number", description: "Lower numbers appear first." }
  ];

  return (
    <CrudManager
      title="Gallery"
      description="Manage DJ and event media."
      table="gallery_items"
      fields={fields}
      initialRows={data.gallery as unknown as Record<string, unknown>[]}
      defaults={{ media_type: "image", display_order: 1, dj_id: data.djs[0]?.id || "", event_id: "" }}
    />
  );
}
