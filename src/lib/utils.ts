import type { EventRecord, SongRequestStatus } from "@/lib/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number | null | undefined, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value && value % 1 !== 0 ? 2 : 0
  }).format(Number(value || 0));
}

export function formatEventDate(value: string | null | undefined) {
  if (!value) return "Date TBA";
  const date = new Date(value + "T00:00:00");
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "event";
}

export function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function getPublicEventUrl(event: Pick<EventRecord, "slug">) {
  return getAppUrl() + "/event/" + event.slug;
}

export function getQrImageUrl(url: string, size = 360) {
  return "https://api.qrserver.com/v1/create-qr-code/?size=" + size + "x" + size + "&margin=12&data=" + encodeURIComponent(url);
}

export function statusTone(status: SongRequestStatus) {
  if (status === "Approved") return "border-blue-500/50 bg-blue-500/15 text-blue-100";
  if (status === "Played") return "border-emerald-500/50 bg-emerald-500/15 text-emerald-100";
  if (status === "Rejected") return "border-rose-500/50 bg-rose-500/15 text-rose-100";
  return "border-violet-500/50 bg-violet-500/15 text-violet-100";
}

export function countdownLabel(endsAt: string | null) {
  if (!endsAt) return "Live now";
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "Closed";
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return String(minutes) + " min left";
  const hours = Math.floor(minutes / 60);
  return String(hours) + " hr left";
}

export function createClientId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
}
