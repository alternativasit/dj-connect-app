"use client";

export function ImageUploader({ value, onChange, label = "Image URL" }: { value: string; onChange: (value: string) => void; label?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-white">{label}</label>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://..." className="mt-2 w-full rounded-2xl border border-line bg-night px-4 py-3 text-white outline-none focus:border-violet" />
      {value ? <img src={value} alt="Preview" className="mt-3 h-28 w-full rounded-2xl object-cover" /> : null}
    </div>
  );
}
