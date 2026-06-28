"use client";

import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CrudField } from "@/components/admin/crud-manager";

function displayValue(value: unknown, field?: CrudField) {
  const match = field?.options?.find((option) => {
    const optionValue = typeof option === "string" ? option : option.value;
    return optionValue === value;
  });
  if (match && typeof match !== "string") return match.label;
  if (match) return match;
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

export function AdminTable({ rows, fields, onEdit, onDelete, className }: { rows: Record<string, unknown>[]; fields: CrudField[]; onEdit: (row: Record<string, unknown>) => void; onDelete: (row: Record<string, unknown>) => void; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-[22px] border border-line bg-surface", className)}>
      <div className="soft-scrollbar overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="border-b border-line bg-night text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              {fields.slice(0, 6).map((field) => <th key={field.name} className="px-4 py-3 font-semibold">{field.label}</th>)}
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)} className="border-b border-line/70 last:border-0">
                {fields.slice(0, 6).map((field) => (
                  <td key={field.name} className="max-w-[240px] px-4 py-3 text-zinc-300">
                    <span className="line-clamp-2">{displayValue(row[field.name], field)}</span>
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => onEdit(row)} className="rounded-xl border border-line bg-night p-2 text-muted hover:text-white" aria-label="Edit"><Pencil size={16} /></button>
                    <button type="button" onClick={() => onDelete(row)} className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-rose-200" aria-label="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
