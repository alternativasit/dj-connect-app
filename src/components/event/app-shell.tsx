import type { ReactNode } from "react";
import { BottomNav } from "@/components/event/bottom-nav";
import { Header } from "@/components/event/header";
import { SiteFooter } from "@/components/ui/site-footer";
import type { EventStatus } from "@/lib/types";

export function AppShell({
  children,
  eventSlug,
  eventId,
  title,
  subtitle,
  status = "Live",
  hideBottomNav = false,
  previewMode = false
}: {
  children: ReactNode;
  eventSlug: string;
  eventId?: string;
  title: string;
  subtitle?: string;
  status?: EventStatus;
  hideBottomNav?: boolean;
  previewMode?: boolean;
}) {
  return (
    <div className="min-h-screen bg-night/70 text-white">
      <Header title={title} subtitle={subtitle} eventSlug={eventSlug} eventId={eventId} status={status} previewMode={previewMode} />
      <main className="mx-auto w-full max-w-5xl px-4 py-5 safe-bottom">
        {children}
        <SiteFooter />
      </main>
      {!hideBottomNav ? <BottomNav eventSlug={eventSlug} previewMode={previewMode} /> : null}
    </div>
  );
}
