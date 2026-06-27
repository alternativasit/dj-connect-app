import { AdminDashboardContent } from "@/components/admin/admin-dashboard-content";
import { getAdminData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const data = await getAdminData();
  return <AdminDashboardContent initialData={data} />;
}
