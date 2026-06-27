import Link from "next/link";
import { ExternalLink, Instagram, Music, Youtube } from "lucide-react";
import { DarkCard } from "@/components/ui/dark-card";
import type { DJ } from "@/lib/types";

export function DJProfileCard({ dj, href }: { dj: DJ; href?: string }) {
  const content = (
    <DarkCard className="flex items-center gap-4">
      <img
        src={dj.photo_url || "/icon.svg"}
        alt={dj.name}
        className="h-20 w-20 shrink-0 rounded-[22px] object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet">DJ Profile</p>
        <h3 className="truncate text-xl font-bold text-white">{dj.name}</h3>
        <p className="text-sm text-muted">{dj.role}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-300">
          {dj.genres.map((genre) => <span key={genre} className="rounded-full border border-line px-2 py-1">{genre}</span>)}
        </div>
        <div className="mt-3 flex gap-3 text-muted">
          {dj.instagram_url ? <Instagram size={16} /> : null}
          {dj.youtube_url ? <Youtube size={16} /> : null}
          {dj.soundcloud_url || dj.mixcloud_url ? <Music size={16} /> : null}
          {href ? <ExternalLink size={16} /> : null}
        </div>
      </div>
    </DarkCard>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
