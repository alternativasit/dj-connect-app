"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Building2, CalendarDays, Disc3, GalleryHorizontal, GlassWater, Gift, LogOut, Music2, Package, Radio, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { ReactNode } from "react";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const links = [
    { label: "Dashboard", href: "/admin", icon: BarChart3 },
    { label: "DJs", href: "/admin/djs", icon: UserRound },
    { label: "Events", href: "/admin/events", icon: CalendarDays },
    { label: "Venues", href: "/admin/venues", icon: Building2 },
    { label: "Packages", href: "/admin/packages", icon: Package },
    { label: "Gallery", href: "/admin/gallery", icon: GalleryHorizontal }
  ];

  async function logout() {
    const supabase = getSupabaseBrowserClient();
    if (isSupabaseConfigured() && supabase) await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-night text-white lg:grid lg:h-screen lg:grid-cols-[280px_1fr] lg:overflow-hidden">
      <aside className="border-b border-line bg-surface/80 p-4 backdrop-blur lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-line bg-night text-violet"><Disc3 size={22} /></span>
          <span>
            <strong className="block text-lg">DJ Connect</strong>
            <span className="text-xs text-muted">Admin Dashboard</span>
          </span>
        </Link>
        <nav className="mt-6 flex gap-2 overflow-x-auto lg:block lg:space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href} className={cn("flex shrink-0 items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-muted", active && "bg-night text-white")}>
                <Icon size={17} />{link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 grid gap-2 rounded-[20px] border border-line bg-night p-3 text-xs text-muted">
          <Link className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-surface hover:text-white" href="/admin/events/33333333-3333-4333-8333-333333333333/requests"><Music2 size={14} />Song Requests</Link>
          <Link className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-surface hover:text-white" href="/admin/events/33333333-3333-4333-8333-333333333333/polls"><Radio size={14} />Live Polls</Link>
          <Link className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-surface hover:text-white" href="/admin/events/33333333-3333-4333-8333-333333333333/drinks"><GlassWater size={14} />Drinks</Link>
          <Link className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-surface hover:text-white" href="/admin/events/33333333-3333-4333-8333-333333333333/promos"><Gift size={14} />Promos</Link>
        </div>
        <button type="button" onClick={logout} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-night px-3 py-2 text-sm text-muted hover:text-white">
          <LogOut size={16} />Logout
        </button>
      </aside>
      <main className="min-w-0 p-4 lg:h-screen lg:overflow-y-auto lg:p-8">{children}</main>
    </div>
  );
}
