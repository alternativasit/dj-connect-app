import { CrudManager, type CrudField, type CrudOption } from "@/components/admin/crud-manager";
import { getAdminData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function toOptions(items: { id: string; name: string }[], emptyLabel?: string): CrudOption[] {
  const options: CrudOption[] = items.map((item) => ({ label: item.name, value: item.id }));
  return emptyLabel ? [{ label: emptyLabel, value: "" }, ...options] : options;
}

export default async function AdminPackagesPage() {
  const data = await getAdminData();
  const djOptions = toOptions(data.djs, "Select DJ");

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
      description: "Choose which DJ offers this package."
    },
    { name: "title", label: "Package title", required: true, description: "Name guests or venues will understand quickly.", placeholder: "Wedding DJ Package, Club Night, Private Event..." },
    { name: "description", label: "Description", type: "textarea", description: "Short sales description for this service.", placeholder: "Includes DJ set, sound check, setup and event support..." },
    { name: "price_from", label: "Starting price", type: "number", description: "Optional starting price. Use numbers only.", placeholder: "500" },
    { name: "includes", label: "Includes", type: "textarea", description: "List what is included in this package.", placeholder: "DJ set, controller, lighting, travel..." },
    { name: "image_url", label: "Package image URL", type: "image", description: "Optional image that represents this package.", placeholder: "https://..." },
    { name: "is_active", label: "Active package", type: "boolean", description: "Turn this off to hide the package from public DJ profiles." }
  ];

  return (
    <CrudManager
      title="Packages"
      description="Manage DJ packages and services."
      table="dj_packages"
      fields={fields}
      initialRows={data.packages as unknown as Record<string, unknown>[]}
      defaults={{ is_active: true, dj_id: data.djs[0]?.id || "" }}
    />
  );
}
