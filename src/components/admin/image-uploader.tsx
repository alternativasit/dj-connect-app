"use client";

import { useEffect, useState } from "react";
import { ExternalLink, ImageOff } from "lucide-react";

export function ImageUploader({ value, onChange, label = "Image URL", description, placeholder = "https://..." }: { value: string; onChange: (value: string) => void; label?: string; description?: string; placeholder?: string }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [value]);

  return (
    <div>
      <label className="text-sm font-medium text-white">{label}</label>
      {description ? <p className="mt-1 text-xs leading-5 text-muted">{description}</p> : null}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-line bg-night px-4 py-3 text-white outline-none focus:border-violet" />
      {value ? failed ? (
        <div className="mt-3 rounded-2xl border border-line bg-night p-4 text-xs leading-5 text-muted">
          <p className="flex items-center gap-2 font-semibold text-zinc-200"><ImageOff size={16} />Preview unavailable</p>
          <p className="mt-2">Use a direct image URL ending in .jpg, .png, .webp, or a public video link. Page links from stock sites usually cannot render as images.</p>
          <a href={value} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 font-semibold text-violet">
            Open link <ExternalLink size={13} />
          </a>
        </div>
      ) : (
        <img src={value} alt="Preview" onError={() => setFailed(true)} className="mt-3 h-28 w-full rounded-2xl object-cover" />
      ) : null}
    </div>
  );
}
