import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminGate } from "@/components/auth/admin-gate";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGate>
      <AdminShell>{children}</AdminShell>
    </AdminGate>
  );
}
