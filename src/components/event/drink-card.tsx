import { BadgeDollarSign } from "lucide-react";
import { DarkCard } from "@/components/ui/dark-card";
import type { Drink } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function DrinkCard({ drink }: { drink: Drink }) {
  return (
    <DarkCard className="overflow-hidden p-0">
      {drink.image_url ? <img src={drink.image_url} alt={drink.name} className="h-36 w-full object-cover" /> : null}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted">{drink.category}</p>
            <h3 className="text-lg font-semibold text-white">{drink.name}</h3>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-line px-2 py-1 text-sm font-semibold text-white">
            <BadgeDollarSign size={14} />{formatCurrency(drink.price)}
          </span>
        </div>
        {drink.description ? <p className="mt-2 text-sm leading-5 text-muted">{drink.description}</p> : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {drink.promo_text ? <span className="rounded-full bg-violet/20 px-2.5 py-1 text-xs font-semibold text-violet-100">{drink.promo_text}</span> : null}
          <span className="rounded-full border border-line px-2.5 py-1 text-xs text-zinc-300">
            {drink.is_available ? "Available" : "Not available"}
          </span>
        </div>
      </div>
    </DarkCard>
  );
}
