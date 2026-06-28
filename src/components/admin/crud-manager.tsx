"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [rows, setRows] = useState<Record<string, unknown>[]>(initialRows);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({ ...defaults });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let query = supabase.from(table).select("*");
    if (filter) query = query.eq(filter.column, filter.value);
    query.then(({ data }) => {
      if (data) setRows(data as Record<string, unknown>[]);
    });
  }, [filter?.column, filter?.value, table]);

  const tableFields = useMemo(() => fields.filter((field) => field.type !== "hidden"), [fields]);

  function updateField(name: string, value: unknown) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function normalizePayload(values: Record<string, unknown>) {
    const payload: Record<string, unknown> = { ...defaults, ...values };
    fields.forEach((field) => {
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
    if (payload.name && !payload.slug && fields.some((field) => field.name === "slug")) payload.slug = slugify(String(payload.name));
    if (table === "events" && payload.slug) {
      const appUrl = typeof window !== "undefined" ? window.location.origin : "";
      payload.qr_url = appUrl + "/event/" + String(payload.slug);
    }
    if (!payload.created_at) payload.created_at = new Date().toISOString();
    payload.updated_at = new Date().toISOString();
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
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-white">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        </div>
        <button type="button" onClick={() => { setEditing(null); setForm({ ...defaults }); }} className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-white">
          <Plus size={16} />New
        </button>
      </div>
      <AdminForm fields={fields} values={form} onChange={updateField} onSubmit={save} submitLabel={editing ? "Save Changes" : "Create"} />
      {message ? <p className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-muted">{message}</p> : null}
      {rows.length ? <AdminTable rows={rows} fields={tableFields} onEdit={edit} onDelete={remove} /> : <EmptyState title="No records yet" />}
    </div>
  );
}

