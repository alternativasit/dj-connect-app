"use client";

import { ImageUploader } from "@/components/admin/image-uploader";
import type { CrudField, CrudOption } from "@/components/admin/crud-manager";

function getOptionValue(option: CrudOption) {
  return typeof option === "string" ? option : option.value;
}

function getOptionLabel(option: CrudOption) {
  return typeof option === "string" ? option : option.label;
}

function FieldText({ field }: { field: CrudField }) {
  return (
    <>
      <label className="text-sm font-medium text-white">{field.label}</label>
      {field.description ? <p className="mt-1 text-xs leading-5 text-muted">{field.description}</p> : null}
    </>
  );
}

export function AdminForm({ fields, values, onChange, onSubmit, submitLabel }: { fields: CrudField[]; values: Record<string, unknown>; onChange: (name: string, value: unknown) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; submitLabel: string }) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-[22px] border border-line bg-surface p-4 md:grid-cols-2">
      {fields.map((field) => {
        const value = values[field.name];
        const commonClass = "mt-2 w-full rounded-2xl border border-line bg-night px-4 py-3 text-white outline-none focus:border-violet";

        if (field.type === "hidden") return null;
        if (field.type === "boolean") {
          return (
            <label key={field.name} className="rounded-2xl border border-line bg-night px-4 py-3 text-sm text-white">
              <span className="flex items-center gap-3">
                <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(field.name, event.target.checked)} />
                {field.label}
              </span>
              {field.description ? <span className="mt-1 block text-xs leading-5 text-muted">{field.description}</span> : null}
            </label>
          );
        }
        if (field.type === "textarea") {
          return (
            <div key={field.name} className="md:col-span-2">
              <FieldText field={field} />
              <textarea value={String(value || "")} onChange={(event) => onChange(field.name, event.target.value)} placeholder={field.placeholder} className={commonClass + " min-h-24"} />
            </div>
          );
        }
        if (field.type === "select") {
          return (
            <div key={field.name}>
              <FieldText field={field} />
              <select value={String(value || getOptionValue(field.options?.[0] || ""))} onChange={(event) => onChange(field.name, event.target.value)} className={commonClass} required={field.required}>
                {field.options?.map((option) => <option key={getOptionValue(option)} value={getOptionValue(option)}>{getOptionLabel(option)}</option>)}
              </select>
            </div>
          );
        }
        if (field.type === "multiselect") {
          const selected = new Set(Array.isArray(value) ? value.map(String) : String(value || "").split(",").map((item) => item.trim()).filter(Boolean));
          return (
            <div key={field.name} className="md:col-span-2">
              <FieldText field={field} />
              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {field.options?.map((option) => {
                  const optionValue = getOptionValue(option);
                  return (
                    <label key={optionValue} className="flex items-center gap-2 rounded-2xl border border-line bg-night px-4 py-3 text-sm text-white">
                      <input
                        type="checkbox"
                        checked={selected.has(optionValue)}
                        onChange={(event) => {
                          const next = new Set(selected);
                          if (event.target.checked) next.add(optionValue);
                          else next.delete(optionValue);
                          onChange(field.name, Array.from(next));
                        }}
                      />
                      {getOptionLabel(option)}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        }
        if (field.type === "image") {
          return <ImageUploader key={field.name} label={field.label} description={field.description} placeholder={field.placeholder} value={String(value || "")} onChange={(next) => onChange(field.name, next)} />;
        }
        return (
          <div key={field.name}>
            <FieldText field={field} />
            <input
              type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "time" ? "time" : field.type === "url" ? "url" : "text"}
              value={Array.isArray(value) ? value.join(", ") : String(value || "")}
              onChange={(event) => onChange(field.name, event.target.value)}
              placeholder={field.placeholder}
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