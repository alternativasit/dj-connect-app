import { CrudManager, type CrudField } from "@/components/admin/crud-manager";
import { getAdminData } from "@/lib/data";
import type { Venue } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function uniqueOptions(values: Array<string | null | undefined>, fallback: string[]) {
  return Array.from(new Set([...values.filter(Boolean).map(String), ...fallback])).filter(Boolean);
}

function VenueDirectory({ venues }: { venues: Venue[] }) {
  return (
    <section className="rounded-[24px] border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">Registered Venues</h2>
          <p className="mt-1 text-sm text-muted">Venues available for events, menus and promos.</p>
        </div>
        <span className="rounded-full border border-line bg-night px-3 py-1 text-xs font-semibold text-white">{venues.length} venues</span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {venues.map((venue) => (
          <article key={venue.id} className="rounded-[18px] border border-line bg-night p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-white">{venue.name}</h3>
                <p className="mt-1 text-sm text-muted">{venue.city || "No city"}{venue.state ? `, ${venue.state}` : ""}</p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${venue.is_active ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-line text-muted"}`}>
                {venue.is_active ? "Active" : "Hidden"}
              </span>
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-zinc-400">{venue.address || "No address saved yet."}</p>
            {venue.contact_name ? <p className="mt-2 text-xs text-muted">Contact: {venue.contact_name}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function AdminVenuesPage() {
  const data = await getAdminData();
  const cityOptions = uniqueOptions(data.venues.map((venue) => venue.city), ["Mexico City", "Guadalajara", "Monterrey", "New York", "Los Angeles", "Miami", "Las Vegas"]);
  const stateOptions = uniqueOptions(data.venues.map((venue) => venue.state), ["CDMX", "Jalisco", "Nuevo Leon", "New York", "California", "Florida", "Nevada", "Texas"]);
  const countryOptions = uniqueOptions(data.venues.map((venue) => venue.country), ["Mexico", "United States", "Canada", "Colombia", "Spain", "MX", "US"]);

  const fields: CrudField[] = [
    { name: "name", label: "Venue name", required: true, description: "Business or venue name shown in event pages.", placeholder: "Rooftop Lounge" },
    { name: "logo_url", label: "Venue logo URL", type: "image", description: "Optional logo image URL for this venue.", placeholder: "https://..." },
    { name: "address", label: "Street address", description: "Full venue address or short location reference.", placeholder: "Av. Reforma 500" },
    { name: "city", label: "City", type: "combobox", options: cityOptions, description: "Choose a suggested city or type a new one.", placeholder: "Mexico City" },
    { name: "state", label: "State / region", type: "combobox", options: stateOptions, description: "State, province or region.", placeholder: "CDMX" },
    { name: "country", label: "Country", type: "combobox", options: countryOptions, description: "Choose a suggested country or type a new one.", placeholder: "Mexico" },
    { name: "phone", label: "Phone number", description: "Venue phone number with area or country code.", placeholder: "+52 55 1234 5678" },
    { name: "website", label: "Website URL", type: "url", description: "Venue website. You can paste it with or without https://.", placeholder: "rooftoplounge.com" },
    { name: "instagram_url", label: "Instagram URL", type: "url", description: "Venue Instagram profile. You can paste it with or without https://.", placeholder: "instagram.com/venue" },
    { name: "contact_name", label: "Contact person", description: "Main contact for bookings or promotions.", placeholder: "Maria Gonzalez" },
    { name: "is_active", label: "Active venue", type: "boolean", description: "Turn this off to hide the venue from admin selectors." }
  ];

  return (
    <div className="space-y-7">
      <VenueDirectory venues={data.venues} />
      <CrudManager title="Venues" description="Manage venues and business profiles." table="venues" fields={fields} initialRows={data.venues as unknown as Record<string, unknown>[]} defaults={{ is_active: true }} />
    </div>
  );
}
