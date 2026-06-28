"use client";

export function ImageUploader({ value, onChange, label = "Image URL", description, placeholder = "https://..." }: { value: string; onChange: (value: string) => void; label?: string; description?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-white">{label}</label>
      {description ? <p className="mt-1 text-xs leading-5 text-muted">{description}</p> : null}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-line bg-night px-4 py-3 text-white outline-none focus:border-violet" />
      {value ? <img src={value} alt="Preview" className="mt-3 h-28 w-full rounded-2xl object-cover" /> : null}
    </div>
  );
}