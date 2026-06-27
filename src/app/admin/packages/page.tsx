import { CrudManager, type CrudField } from "@/components/admin/crud-manager";
import { getAdminData } from "@/lib/data";

const fields: CrudField[] = [
  { name: "dj_id", label: "DJ ID", required: true },
  { name: "title", label: "Title", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "price_from", label: "Price from", type: "number" },
  { name: "includes", label: "Includes", type: "textarea" },
  { name: "image_url", label: "Image", type: "image" },
  { name: "is_active", label: "Is active", type: "boolean" }
];

export default async function AdminPackagesPage() {
  const data = await getAdminData();
  return <CrudManager title="Packages" description="Manage DJ packages and services." table="dj_packages" fields={fields} initialRows={data.packages as unknown as Record<string, unknown>[]} defaults={{ is_active: true }} />;
}
