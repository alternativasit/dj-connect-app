import { CrudManager, type CrudField } from "@/components/admin/crud-manager";
import { getAdminData } from "@/lib/data";
import { DjDirectory } from "@/components/admin/dj-directory";
import { cityOptions, countryOptions } from "@/lib/location-options";

const roleOptions = [
  "DJ / Producer",
  "DJ",
  "Producer",
  "Resident DJ",
  "Guest DJ",
  "Open Format DJ",
  "Wedding DJ",
  "Corporate DJ",
  "MC / Host"
];


const genreOptions = [
  "House",
  "Tech House",
  "Melodic",
  "Deep House",
  "EDM",
  "Reggaeton",
  "Latin",
  "Pop",
  "Hip-Hop",
  "R&B",
  "Open Format",
  "Disco",
  "Funk",
  "Afrobeats",
  "Regional Mexican",
  "Rock"
];

const fields: CrudField[] = [
  { name: "name", label: "DJ name", required: true, placeholder: "Alex Beat", description: "Public artist name shown on the DJ profile and event pages." },
  { name: "slug", label: "Slug", type: "hidden" },
  { name: "photo_url", label: "Profile photo URL", type: "image", placeholder: "https://...", description: "Main DJ photo. Use a square or portrait image for the public profile." },
  { name: "logo_url", label: "Cover / logo image URL", type: "image", placeholder: "https://...", description: "Optional cover, logo, or brand image for the DJ profile." },
  { name: "role", label: "Profile role", type: "select", options: roleOptions, description: "Choose the title that best describes this DJ." },
  { name: "bio", label: "Public bio", type: "textarea", placeholder: "Short intro, music style, residency, experience...", description: "Short description guests and venues will see on the DJ profile." },
  { name: "city", label: "Base city", type: "combobox", options: cityOptions, placeholder: "Start typing a city or write a new one", description: "Choose a suggested city or type a new one if it is not listed." },
  { name: "country", label: "Country", type: "combobox", options: countryOptions, placeholder: "Start typing a country or write a new one", description: "Choose a suggested country or type a new one if it is not listed." },
  { name: "genres", label: "Music genres", type: "multiselect", options: genreOptions, description: "Select all styles that apply. Guests will see these as profile tags." },
  { name: "instagram_url", label: "Instagram URL", type: "url", placeholder: "instagram.com/alexbeatdj", description: "Full Instagram profile link." },
  { name: "tiktok_url", label: "TikTok URL", type: "url", placeholder: "tiktok.com/@alexbeatdj", description: "Full TikTok profile link." },
  { name: "youtube_url", label: "YouTube URL", type: "url", placeholder: "youtube.com/@alexbeatdj", description: "Channel or playlist link for videos and mixes." },
  { name: "featured_video_url", label: "Profile video / featured song URL", type: "url", placeholder: "youtube.com/watch?v=...", description: "Video or song preview shown on the DJ profile. YouTube, YouTube Music, Spotify, Apple Music or SoundCloud links work best." },
  { name: "soundcloud_url", label: "SoundCloud URL", type: "url", placeholder: "soundcloud.com/...", description: "Optional SoundCloud profile or mix link." },
  { name: "mixcloud_url", label: "Mixcloud URL", type: "url", placeholder: "mixcloud.com/...", description: "Optional Mixcloud profile or mix link." },
  { name: "whatsapp", label: "WhatsApp number", placeholder: "+52 55 1234 5678", description: "Booking contact number. Include country code." },
  { name: "email", label: "Booking email", placeholder: "booking@alexbeat.com", description: "Email for bookings and event inquiries." },
  { name: "booking_url", label: "Booking page URL", type: "url", placeholder: "https://...", description: "Optional external booking form, website or calendar link." },
  { name: "tip_paypal_url", label: "PayPal tip link", type: "url", placeholder: "paypal.me/...", description: "External PayPal link used by Tip the DJ." },
  { name: "tip_venmo_url", label: "Venmo tip link", type: "url", placeholder: "venmo.com/...", description: "External Venmo link used by Tip the DJ." },
  { name: "tip_cashapp_url", label: "Cash App tip link", type: "url", placeholder: "cash.app/$...", description: "External Cash App link used by Tip the DJ." },
  { name: "tip_stripe_url", label: "Stripe payment link", type: "url", placeholder: "buy.stripe.com/...", description: "Optional Stripe payment link for tips or deposits." },
  { name: "tip_mercadopago_url", label: "Mercado Pago link", type: "url", placeholder: "mpago.la/...", description: "Optional Mercado Pago link for tips." },
  { name: "is_active", label: "Active DJ profile", type: "boolean", description: "Turn this off to hide this DJ from public event pages." }
];

export default async function AdminDjsPage() {
  const data = await getAdminData();
  return (
    <div className="space-y-5">
      <DjDirectory djs={data.djs} events={data.events} />
      <CrudManager
        title="DJs"
        description="Manage DJ profiles, media, social links, booking and tip links. Slug is generated automatically."
        table="djs"
        fields={fields}
        initialRows={data.djs as unknown as Record<string, unknown>[]}
        defaults={{ is_active: true, genres: [], role: "DJ / Producer", city: "Mexico City", country: "Mexico" }}
      />
    </div>
  );
}