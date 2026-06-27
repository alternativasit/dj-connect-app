"use client";

import { useState } from "react";
import { ExternalLink, HeartHandshake } from "lucide-react";
import { DarkCard } from "@/components/ui/dark-card";
import { getGuestSessionId } from "@/lib/guest-session";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { createClientId, cn } from "@/lib/utils";
import type { DJ, EventRecord } from "@/lib/types";

export function TipPanel({ dj, event }: { dj: DJ; event: EventRecord }) {
  const [amount, setAmount] = useState("10");
  const links = [
    { label: "PayPal", url: dj.tip_paypal_url },
    { label: "Venmo", url: dj.tip_venmo_url },
    { label: "Cash App", url: dj.tip_cashapp_url },
    { label: "Stripe Payment Link", url: dj.tip_stripe_url },
    { label: "Mercado Pago", url: dj.tip_mercadopago_url }
  ].filter((item) => item.url);

  async function trackClick(provider: string) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.from("tip_clicks").insert({
      id: createClientId("tip-click"),
      event_id: event.id,
      dj_id: dj.id,
      provider,
      guest_session_id: getGuestSessionId(),
      created_at: new Date().toISOString()
    });
  }

  return (
    <DarkCard className="space-y-5">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] border border-line bg-night text-magenta">
          <HeartHandshake size={24} />
        </div>
        <h2 className="mt-3 text-2xl font-bold text-white">Tip the DJ</h2>
        <p className="mt-1 text-sm text-muted">{dj.name} · {event.name}</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {["5", "10", "20", "Custom"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setAmount(option === "Custom" ? "" : option)}
            className={cn(
              "rounded-2xl border border-line bg-night px-3 py-3 text-sm font-semibold text-white",
              amount === option || amount === option.replace("$", "") ? "border-violet bg-violet/20" : ""
            )}
          >
            {option === "Custom" ? option : "$" + option}
          </button>
        ))}
      </div>
      <input
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        inputMode="decimal"
        className="w-full rounded-2xl border border-line bg-night px-4 py-3 text-center text-xl font-bold text-white outline-none focus:border-violet"
        placeholder="Custom amount"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url || "#"}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackClick(link.label)}
            className="gradient-button flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white"
          >
            {link.label}
            <ExternalLink size={16} />
          </a>
        ))}
      </div>
    </DarkCard>
  );
}
