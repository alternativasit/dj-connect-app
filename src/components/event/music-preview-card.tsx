import { ExternalLink, Music2 } from "lucide-react";
import { getMusicPreview } from "@/lib/music-preview";

interface MusicPreviewCardProps {
  url?: string | null;
  title?: string | null;
  artist?: string | null;
  compact?: boolean;
}

export function MusicPreviewCard({ url, title, artist, compact = false }: MusicPreviewCardProps) {
  const label = [title, artist].filter(Boolean).join(" - ") || "Music preview";
  const preview = getMusicPreview(url, label);
  if (!preview) return null;

  const isYouTube = preview.provider === "YouTube" || preview.provider === "YouTube Music";
  const frameClass = isYouTube
    ? compact ? "h-36 w-full rounded-2xl" : "aspect-video w-full rounded-2xl"
    : compact ? "h-28 w-full rounded-2xl" : "h-44 w-full rounded-2xl";

  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-black/40">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-violet"><Music2 size={13} />{preview.provider}</p>
          {!compact ? <p className="mt-1 truncate text-sm font-semibold text-white">{preview.title}</p> : null}
        </div>
        <a href={preview.externalUrl} target="_blank" rel="noreferrer" className="shrink-0 rounded-xl border border-line bg-surface2 p-2 text-zinc-200" aria-label="Open music link">
          <ExternalLink size={14} />
        </a>
      </div>
      {preview.embedUrl ? (
        <iframe
          title={preview.title}
          src={preview.embedUrl}
          className={frameClass}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : preview.imageUrl ? (
        <img src={preview.imageUrl} alt={preview.title} className={compact ? "h-32 w-full object-cover" : "h-52 w-full object-cover"} />
      ) : (
        <div className="flex min-h-24 items-center justify-center px-4 text-center text-sm text-muted">Open the music link to preview this request.</div>
      )}
    </div>
  );
}
