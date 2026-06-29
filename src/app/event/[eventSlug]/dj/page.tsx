import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ExternalLink, HeartHandshake, Mail, MessageCircle } from "lucide-react";
import { AppShell } from "@/components/event/app-shell";
import { GalleryMediaCard } from "@/components/event/gallery-media-card";
import { MusicPreviewCard } from "@/components/event/music-preview-card";
import { DarkCard } from "@/components/ui/dark-card";
import { getEventBundle } from "@/lib/data";
import { formatCurrency, formatEventDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DJPage({ params, searchParams }: { params: { eventSlug: string }; searchParams?: { preview?: string } }) {
  const isAdminPreview = searchParams?.preview === "admin";
  const previewQuery = isAdminPreview ? "?preview=admin" : "";
  const bundle = await getEventBundle(params.eventSlug, { includeInactive: isAdminPreview });
  if (!bundle) notFound();

  const base = "/event/" + bundle.event.slug;
  const socialLinks = [
    { label: "Instagram", url: bundle.dj.instagram_url },
    { label: "TikTok", url: bundle.dj.tiktok_url },
    { label: "YouTube", url: bundle.dj.youtube_url },
    { label: "SoundCloud", url: bundle.dj.soundcloud_url },
    { label: "Mixcloud", url: bundle.dj.mixcloud_url }
  ].filter((item) => item.url);

  return (
    <AppShell eventSlug={bundle.event.slug} eventId={bundle.event.id} title="DJ Profile" subtitle={bundle.dj.name} status={bundle.event.status} previewMode={isAdminPreview}>
      <div className="space-y-5">
        <DarkCard className="overflow-hidden p-0">
          <div className="h-56 bg-surface2">
            <img src={bundle.dj.photo_url || "/icon.svg"} alt={bundle.dj.name} className="h-full w-full object-cover" />
          </div>
          <div className="p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-violet">{bundle.dj.role}</p>
            <h2 className="mt-1 text-3xl font-black text-white">{bundle.dj.name}</h2>
            <p className="mt-2 text-sm text-muted">{bundle.dj.city}, {bundle.dj.country}</p>
            {bundle.dj.bio ? <p className="mt-4 leading-7 text-zinc-300">{bundle.dj.bio}</p> : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {bundle.dj.genres.map((genre) => <span key={genre} className="rounded-full border border-line px-3 py-1.5 text-sm text-zinc-300">{genre}</span>)}
            </div>
          </div>
        </DarkCard>

        {bundle.dj.featured_video_url ? (
          <DarkCard>
            <h3 className="text-lg font-semibold text-white">Featured Video</h3>
            <div className="mt-4">
              <MusicPreviewCard url={bundle.dj.featured_video_url} title={bundle.dj.name + " featured video"} />
            </div>
          </DarkCard>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Link href={base + "/tip" + previewQuery} className="gradient-button flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold text-white"><HeartHandshake size={18} />Tip the DJ</Link>
          <a href={bundle.dj.booking_url || "mailto:" + bundle.dj.email} className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 font-semibold text-white"><Mail size={18} />Book Now</a>
        </div>

        <DarkCard>
          <h3 className="text-lg font-semibold text-white">Social & Mixes</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.url || "#"} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-line bg-night px-4 py-3 text-sm text-white">
                {link.label}<ExternalLink size={15} />
              </a>
            ))}
            {bundle.dj.whatsapp ? <a href={"https://wa.me/" + bundle.dj.whatsapp.replace(/\D/g, "")} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-line bg-night px-4 py-3 text-sm text-white">WhatsApp<MessageCircle size={15} /></a> : null}
          </div>
        </DarkCard>

        <DarkCard>
          <h3 className="text-lg font-semibold text-white">Gallery</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {bundle.gallery.map((item) => <GalleryMediaCard key={item.id} item={item} />)}
          </div>
        </DarkCard>

        <DarkCard>
          <h3 className="text-lg font-semibold text-white">Packages & Services</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {bundle.packages.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-[20px] border border-line bg-night">
                {item.image_url ? <img src={item.image_url} alt={item.title} className="h-36 w-full object-cover" /> : null}
                <div className="p-4">
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  {item.description ? <p className="mt-2 text-sm text-muted">{item.description}</p> : null}
                  <p className="mt-3 text-sm font-semibold text-violet-100">From {formatCurrency(item.price_from)}</p>
                  {item.includes ? <p className="mt-2 text-xs text-zinc-500">{item.includes}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </DarkCard>

        <DarkCard>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white"><CalendarDays size={18} />Upcoming Events</h3>
          <div className="mt-4 space-y-3">
            {bundle.upcomingEvents.map((event) => (
              <article key={event.id} className="rounded-2xl border border-line bg-night p-4">
                <h4 className="font-semibold text-white">{event.name}</h4>
                <p className="text-sm text-muted">{formatEventDate(event.event_date)}</p>
              </article>
            ))}
          </div>
        </DarkCard>
      </div>
    </AppShell>
  );
}
