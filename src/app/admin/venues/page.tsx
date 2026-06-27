import { CrudManager, type CrudField } from "@/components/admin/crud-manager";
import { getAdminData } from "@/lib/data";

const fields: CrudField[] = [
  { name: "name", label: "Name", required: true },
  { name: "logo_url", label: "Logo", type: "image" },
  { name: "address", label: "Address" },
  { name: "city", label: "City" },
  { name: "state", label: "State" },
  { name: "country", label: "Country" },
  { name: "phone", label: "Phone" },
  { name: "website", label: "Website", type: "url" },
  { name: "instagram_url", label: "Instagram", type: "url" },
  { name: "contact_name", label: "Contact name" },
  { name: "is_active", label: "Is active", type: "boolean" }
];

export default async function AdminVenuesPage() {
  const data = await getAdminData();
  return <CrudManager title="Venues" description="Manage venues and business profiles." table="venues" fields={fields} initialRows={data.venues as unknown as Record<string, unknown>[]} defaults={{ is_active: true }} />;
}
