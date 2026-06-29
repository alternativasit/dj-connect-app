import Link from "next/link";
import { Gift, GlassWater, ListMusic, QrCode, Radio } from "lucide-react";
import { EventDetailActions } from "@/components/admin/event-detail-actions";
import { QRCard } from "@/components/event/qr-card";
import { DarkCard } from "@/components/ui/dark-card";
import { getEventById } from "@/lib/data";
import { getPublicEventUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminEventDetailPage({ params }: { params: { eventId: string } }) {
  const bundle = await getEventById(params.eventId);
  const links = [
    { label: "Song Requests", href: "/admin/events/" + bundle.event.id + "/requests", icon: <ListMusic size={18} /> },
    { label: "Live Polls", href: "/admin/events/" + bundle.event.id + "/polls", icon: <Radio size={18} /> },
    { label: "Drinks Menu", href: "/admin/events/" + bundle.event.id + "/drinks", icon: <GlassWater size={18} /> },
    { label: "Event Promos", href: "/admin/events/" + bundle.event.id + "/promos", icon: <Gift size={18} /> }
  ];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-violet">Admin Event Detail</p>
        <h1 className="mt-1 text-3xl font-black text-white">{bundle.event.name}</h1>
        <p className="mt-1 text-sm text-muted">Public URL: {getPublicEventUrl(bundle.event)}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <QRCard url={getPublicEventUrl(bundle.event)} title="Event QR" />
        <DarkCard>
          <h2 className="flex items-center gap-2 text-xl font-bold"><QrCode size={20} />Quick panels</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-2xl border border-line bg-night px-4 py-4 font-semibold text-white">
                <span className="text-violet">{link.icon}</span>{link.label}
              </Link>
            ))}
            <Link href={"/event/" + bundle.event.slug + "/screen"} className="gradient-button rounded-2xl px-4 py-4 text-center font-semibold text-white">Screen Mode</Link>
            <Link href={"/event/" + bundle.event.slug} className="rounded-2xl border border-line bg-night px-4 py-4 text-center font-semibold text-white">Guest Home</Link>
          </div>
        </DarkCard>
      </div>
      <EventDetailActions event={bundle.event} />
    </div>
  );
}
