"use client";

import { ImageUploader } from "@/components/admin/image-uploader";
import type { CrudField } from "@/components/admin/crud-manager";

export function AdminForm({ fields, values, onChange, onSubmit, submitLabel }: { fields: CrudField[]; values: Record<string, unknown>; onChange: (name: string, value: unknown) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; submitLabel: string }) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-[22px] border border-line bg-surface p-4 md:grid-cols-2">
      {fields.map((field) => {
        const value = values[field.name];
        const commonClass = "mt-2 w-full rounded-2xl border border-line bg-night px-4 py-3 text-white outline-none focus:border-violet";

        if (field.type === "hidden") return null;
        if (field.type === "boolean") {
          return (
            <label key={field.name} className="flex items-center gap-3 rounded-2xl border border-line bg-night px-4 py-3 text-sm text-white">
              <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(field.name, event.target.checked)} />
              {field.label}
            </label>
          );
        }
        if (field.type === "textarea") {
          return (
            <div key={field.name} className="md:col-span-2">
              <label className="text-sm font-medium text-white">{field.label}</label>
              <textarea value={String(value || "")} onChange={(event) => onChange(field.name, event.target.value)} className={commonClass + " min-h-24"} />
            </div>
          );
        }
        if (field.type === "select") {
          return (
            <div key={field.name}>
              <label className="text-sm font-medium text-white">{field.label}</label>
              <select value={String(value || field.options?.[0] || "")} onChange={(event) => onChange(field.name, event.target.value)} className={commonClass}>
                {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          );
        }
        if (field.type === "image") {
          return <ImageUploader key={field.name} label={field.label} value={String(value || "")} onChange={(next) => onChange(field.name, next)} />;
        }
        return (
          <div key={field.name}>
            <label className="text-sm font-medium text-white">{field.label}</label>
            <input
              type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "time" ? "time" : field.type === "url" ? "url" : "text"}
              value={Array.isArray(value) ? value.join(", ") : String(value || "")}
              onChange={(event) => onChange(field.name, event.target.value)}
              className={commonClass}
              required={field.required}
            />
          </div>
        );
      })}
      <button type="submit" className="gradient-button rounded-2xl px-4 py-3 font-semibold text-white md:col-span-2">{submitLabel}</button>
    </form>
  );
}
