"use client";

import { useState } from "react";
import { ImageOff, PlayCircle } from "lucide-react";
import { MusicPreviewCard } from "@/components/event/music-preview-card";
import type { GalleryItem } from "@/lib/types";

export function GalleryMediaCard({ item }: { item: GalleryItem }) {
  const [failed, setFailed] = useState(false);

  if (item.media_type === "video") {
    return (
      <figure className="overflow-hidden rounded-[20px] border border-line bg-night">
        <div className="p-2">
          <MusicPreviewCard url={item.media_url} title={item.caption || "Gallery video"} compact />
        </div>
        {item.caption ? (
          <figcaption className="flex items-center gap-2 p-2 text-xs text-muted">
            <PlayCircle size={13} />
            {item.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className="overflow-hidden rounded-[20px] border border-line bg-night">
      {!failed ? (
        <img src={item.media_url} alt={item.caption || "DJ gallery"} onError={() => setFailed(true)} className="h-36 w-full object-cover" />
      ) : (
        <div className="flex h-36 flex-col items-center justify-center gap-2 px-4 text-center text-xs text-muted">
          <ImageOff size={24} className="text-zinc-500" />
          <span>Media unavailable</span>
        </div>
      )}
      {item.caption ? <figcaption className="p-2 text-xs text-muted">{item.caption}</figcaption> : null}
    </figure>
  );
}
