import { CrudManager, type CrudField } from "@/components/admin/crud-manager";
import { getAdminData } from "@/lib/data";

const fields: CrudField[] = [
  { name: "name", label: "Name", required: true },
  { name: "slug", label: "Slug", required: true },
  { name: "photo_url", label: "Photo", type: "image" },
  { name: "logo_url", label: "Logo URL", type: "url" },
  { name: "role", label: "Role" },
  { name: "bio", label: "Bio", type: "textarea" },
  { name: "city", label: "City" },
  { name: "country", label: "Country" },
  { name: "genres", label: "Genres", type: "tags" },
  { name: "instagram_url", label: "Instagram", type: "url" },
  { name: "tiktok_url", label: "TikTok", type: "url" },
  { name: "youtube_url", label: "YouTube", type: "url" },
  { name: "soundcloud_url", label: "SoundCloud", type: "url" },
  { name: "mixcloud_url", label: "Mixcloud", type: "url" },
  { name: "whatsapp", label: "WhatsApp" },
  { name: "email", label: "Email" },
  { name: "booking_url", label: "Booking URL", type: "url" },
  { name: "tip_paypal_url", label: "PayPal", type: "url" },
  { name: "tip_venmo_url", label: "Venmo", type: "url" },
  { name: "tip_cashapp_url", label: "Cash App", type: "url" },
  { name: "tip_stripe_url", label: "Stripe", type: "url" },
  { name: "tip_mercadopago_url", label: "Mercado Pago", type: "url" },
  { name: "is_active", label: "Is active", type: "boolean" }
];

export default async function AdminDjsPage() {
  const data = await getAdminData();
  return <CrudManager title="DJs" description="Manage DJ profiles, social links, booking and tip links." table="djs" fields={fields} initialRows={data.djs as unknown as Record<string, unknown>[]} defaults={{ is_active: true, genres: [] }} />;
}
