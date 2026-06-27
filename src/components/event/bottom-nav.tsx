"use client";

import Link from "next/link";
import { Home, Music2, QrCode, Radio, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function BottomNav({ eventSlug }: { eventSlug: string }) {
  const pathname = usePathname();
  const base = "/event/" + eventSlug;
  const items = [
    { label: "Home", href: base, icon: Home },
    { label: "Songs", href: base + "/request-song", icon: Music2 },
    { label: "Scan", href: base + "#qr", icon: QrCode },
    { label: "Polls", href: base + "/polls", icon: Radio },
    { label: "Profile", href: base + "/dj", icon: UserRound }
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-night/92 px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const active = item.href === base ? pathname === base : pathname.startsWith(item.href.split("#")[0]);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium text-muted",
                active && "bg-surface2 text-white"
              )}
            >
              <Icon size={18} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
