import Image from "next/image";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className={compact ? "mt-8 border-t border-line/70 pt-5" : "mt-10 border-t border-line/70 pt-5"}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-line bg-white/5 p-1.5 opacity-75 grayscale transition hover:border-violet hover:opacity-100 hover:grayscale-0">
            <Image src="/brand/smart-menu.png" alt="Smart Menu logo" width={48} height={42} className="h-full w-full object-contain" />
          </div>
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-line bg-white p-1 opacity-75 grayscale transition hover:border-violet hover:opacity-100 hover:grayscale-0">
            <Image src="/brand/viralo.jpg" alt="Viralo logo" width={48} height={48} className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/85">Smart Menu + Viralo</p>
            <p className="text-xs text-muted">Sister companies building digital guest experiences.</p>
          </div>
        </div>
        <div className="max-w-2xl text-xs leading-relaxed text-muted sm:text-right">
          <p>&copy; {year} Smart Menu and Viralo. All rights reserved.</p>
          <p>DJ Connect and related digital experiences are intellectual property of Smart Menu and Viralo.</p>
        </div>
      </div>
    </footer>
  );
}
