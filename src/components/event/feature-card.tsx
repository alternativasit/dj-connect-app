import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DarkCard } from "@/components/ui/dark-card";

export function FeatureCard({ title, text, href, icon }: { title: string; text: string; href: string; icon: ReactNode }) {
  return (
    <Link href={href} className="block">
      <DarkCard className="flex h-full items-center gap-4 transition hover:border-violet/70 hover:bg-surface2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-line bg-night text-violet">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{text}</p>
        </div>
        <ChevronRight className="shrink-0 text-muted" size={18} />
      </DarkCard>
    </Link>
  );
}
