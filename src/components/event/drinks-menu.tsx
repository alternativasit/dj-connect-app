"use client";

import { useMemo, useState } from "react";
import { DrinkCard } from "@/components/event/drink-card";
import type { Drink } from "@/lib/types";
import { cn } from "@/lib/utils";

const preferredOrder = ["Cocktails", "Beer", "Shots", "Bottle Service", "Non-alcoholic", "Specials"];

export function DrinksMenu({ drinks }: { drinks: Drink[] }) {
  const categories = useMemo(() => {
    const found = Array.from(new Set(drinks.map((drink) => drink.category)));
    return preferredOrder.filter((item) => found.includes(item)).concat(found.filter((item) => !preferredOrder.includes(item)));
  }, [drinks]);
  const [active, setActive] = useState(categories[0] || "Cocktails");
  const filtered = drinks.filter((drink) => drink.category === active);

  return (
    <div className="space-y-4">
      <div className="soft-scrollbar flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            className={cn(
              "shrink-0 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted",
              active === category && "gradient-button border-transparent text-white"
            )}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((drink) => <DrinkCard key={drink.id} drink={drink} />)}
      </div>
    </div>
  );
}
