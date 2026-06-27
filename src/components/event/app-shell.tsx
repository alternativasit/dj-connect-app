import type { ReactNode } from "react";
import { BottomNav } from "@/components/event/bottom-nav";
import { Header } from "@/components/event/header";
import type { EventStatus } from "@/lib/types";

export function AppShell({
  children,
  eventSlug,
  title,
  subtitle,
  status = "Live",
  hideBottomNav = false
}: {
  children: ReactNode;
  eventSlug: string;
  title: string;
  subtitle?: string;
  status?: EventStatus;
  hideBottomNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-night/70 text-white">
      <Header title={title} subtitle={subtitle} eventSlug={eventSlug} status={status} />
      <main className="mx-auto w-full max-w-5xl px-4 py-5 safe-bottom">{children}</main>
      {!hideBottomNav ? <BottomNav eventSlug={eventSlug} /> : null}
    </div>
  );
}
