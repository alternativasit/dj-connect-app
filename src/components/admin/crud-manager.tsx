"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminTable } from "@/components/admin/admin-table";
import { EmptyState } from "@/components/ui/empty-state";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { createClientId, slugify } from "@/lib/utils";

export type CrudOption = string | { label: string; value: string };

export type CrudField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean" | "select" | "combobox" | "multiselect" | "date" | "time" | "url" | "image" | "tags" | "hidden";
  options?: CrudOption[];
  sourceTable?: string;
  optionLabel?: string;
  emptyLabel?: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
};

type Filter = { column: string; value: string };

function getRecordLabel(table: string) {
  if (table === "djs") return "DJ profile";
  if (table === "events") return "Event";
  if (table === "venues") return "Venue";
  if (table === "dj_packages") return "Package";
  if (table === "gallery_items") return "Gallery item";
  if (table === "song_requests") return "Song request";
  return "Record";
}

const tablesWithUpdatedAt = new Set([
  "djs",
  "venues",
  "events",
  "song_requests",
  "polls",
  "drinks",
  "promos",
  "dj_packages"
]);

async function getAdminToken() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

async function runAdminMutation(input: { table: string; action: "insert" | "update" | "delete"; id?: string; payload?: Record<string, unknown> }) {
  const token = await getAdminToken();
  if (!token) throw new Error("Please log in again before saving.");
  const response = await fetch("/api/admin/crud", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify(input)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Could not save.");
  return result as { ok: boolean; row?: Record<string, unknown> };
}

async function runAdminList(table: string, filter?: Filter) {
  const token = await getAdminToken();
  if (!token) throw new Error("Please log in again before loading admin lists.");
  const params = new URLSearchParams({ table });
  if (filter) {
    params.set("filterColumn", filter.column);
    params.set("filterValue", filter.value);
  }
  const response = await fetch(`/api/admin/crud?${params.toString()}`, {
    headers: { authorization: `Bearer ${token}` }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Could not load admin lists.");
  return (result.rows || []) as Record<string, unknown>[];
}

export function CrudManager({
  title,
  description,
  table,
  fields,
  initialRows,
  defaults = {},
  filter
}: {
  title: string;
  description?: string;
  table: string;
  fields: CrudField[];
  initialRows: Record<string, unknown>[];
  defaults?: Record<string, unknown>;
  filter?: Filter;
}) {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<Record<string, unknown>[]>(initialRows);
  const [formFields, setFormFields] = useState<CrudField[]>(fields);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({ ...defaults });
  const [message, setMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const filterColumn = filter?.column;
  const filterValue = filter?.value;

  useEffect(() => {
    setFormFields(fields);
  }, [fields]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setMessage("");
      setEditing(null);
      setForm({ ...defaults });
      setFormOpen(true);
    }
  }, [defaults, searchParams]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let query = supabase.from(table).select("*");
    if (filterColumn && filterValue) query = query.eq(filterColumn, filterValue);
    query.then(({ data }) => {
      if (data) setRows(data as Record<string, unknown>[]);
    });
  }, [filterColumn, filterValue, table]);

  useEffect(() => {
    const sourcedFields = fields.filter((field) => field.sourceTable);
    if (!sourcedFields.length) return;

    let cancelled = false;
    Promise.all(
      sourcedFields.map(async (field) => {
        const list = await runAdminList(String(field.sourceTable));
        const options = list.map((row) => ({
          label: String(row[field.optionLabel || "name"] || row.name || row.id || "Unnamed"),
          value: String(row.id || "")
        }));
        return {
          name: field.name,
          options: field.emptyLabel ? [{ label: field.emptyLabel, value: "" }, ...options] : options
        };
      })
    )
      .then((loadedOptions) => {
        if (cancelled) return;
        setFormFields((current) => current.map((field) => {
          const match = loadedOptions.find((item) => item.name === field.name);
          return match ? { ...field, options: match.options } : field;
        }));
      })
      .catch((error) => {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "Could not load admin lists.");
      });

    return () => {
      cancelled = true;
    };
  }, [fields]);

  const tableFields = useMemo(() => formFields.filter((field) => field.type !== "hidden"), [formFields]);

  function updateField(name: string, value: unknown) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function normalizePayload(values: Record<string, unknown>) {
    const payload: Record<string, unknown> = { ...defaults, ...values };
    formFields.forEach((field) => {
      if (field.type === "number") payload[field.name] = payload[field.name] === "" ? null : Number(payload[field.name]);
      if (field.type === "url") {
        const rawValue = String(payload[field.name] || "").trim();
        if (!rawValue) payload[field.name] = null;
        else payload[field.name] = /^[a-z][a-z0-9+.-]*:\/\//i.test(rawValue) ? rawValue : `https://${rawValue}`;
      }
      if (field.type === "select" && payload[field.name] === "") payload[field.name] = null;
      if (field.type === "multiselect") {
        payload[field.name] = Array.isArray(payload[field.name])
          ? payload[field.name]
          : String(payload[field.name] || "").split(",").map((item) => item.trim()).filter(Boolean);
      }
      if (field.type === "tags") payload[field.name] = String(payload[field.name] || "").split(",").map((item) => item.trim()).filter(Boolean);
    });
    if (!payload.id) payload.id = createClientId(table);
    if ((table === "events" || table === "djs") && payload.name) payload.slug = slugify(String(payload.name));
    if (payload.name && !payload.slug && formFields.some((field) => field.name === "slug")) payload.slug = slugify(String(payload.name));
    if (table === "events" && payload.slug) {
      const appUrl = typeof window !== "undefined" ? window.location.origin : "";
      payload.qr_url = appUrl + "/event/" + String(payload.slug);
    }
    if (!payload.created_at) payload.created_at = new Date().toISOString();
    if (tablesWithUpdatedAt.has(table)) {
      payload.updated_at = new Date().toISOString();
    } else {
      delete payload.updated_at;
    }
    return payload;
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const payload = normalizePayload(form);
    const wasEditing = Boolean(editing);

    try {
      const supabase = getSupabaseBrowserClient();
      let savedRow = payload;
      if (supabase) {
        const result = await runAdminMutation({
          table,
          action: editing ? "update" : "insert",
          id: editing ? String(editing.id) : undefined,
          payload
        });
        savedRow = result.row || payload;
      }
      setRows((current) => {
        const exists = current.some((row) => row.id === savedRow.id);
        return exists ? current.map((row) => row.id === savedRow.id ? savedRow : row) : [savedRow, ...current];
      });
      setEditing(null);
      setForm({ ...defaults });
      setFormOpen(false);
      setMessage(`${getRecordLabel(table)} ${wasEditing ? "updated" : "created"} successfully.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save.");
    }
  }

  async function remove(row: Record<string, unknown>) {
    try {
      const supabase = getSupabaseBrowserClient();
      if (supabase) await runAdminMutation({ table, action: "delete", id: String(row.id) });
      setRows((current) => current.filter((item) => item.id !== row.id));
      setMessage(`${getRecordLabel(table)} deleted successfully.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete.");
    }
  }

  function edit(row: Record<string, unknown>) {
    setEditing(row);
    setForm(row);
    setFormOpen(true);
  }

  function resetForm() {
    setEditing(null);
    setForm({ ...defaults });
    setFormOpen(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-white">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        </div>
        <button type="button" onClick={() => { setMessage(""); setEditing(null); setForm({ ...defaults }); setFormOpen(true); }} className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-white">
          <Plus size={16} />New
        </button>
      </div>
      {formOpen ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">{editing ? `Edit ${getRecordLabel(table)}` : `Create ${getRecordLabel(table)}`}</h2>
            <button type="button" onClick={resetForm} className="rounded-2xl border border-line bg-night px-4 py-2 text-sm font-semibold text-muted hover:text-white">
              Cancel
            </button>
          </div>
          <AdminForm fields={formFields} values={form} onChange={updateField} onSubmit={save} submitLabel={editing ? "Save Changes" : "Create"} />
        </div>
      ) : null}
      {message ? <p className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-muted">{message}</p> : null}
      {rows.length ? <AdminTable rows={rows} fields={tableFields} onEdit={edit} onDelete={remove} /> : <EmptyState title="No records yet" />}
    </div>
  );
}

