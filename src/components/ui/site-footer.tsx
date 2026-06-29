import Image from "next/image";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className={compact ? "mt-8 border-t border-line/70 pt-5" : "mt-10 rounded-[24px] border border-line bg-surface/70 p-5 shadow-glow"}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-line bg-black p-1.5">
            <Image src="/brand/smart-menu.png" alt="Smart Menu logo" width={72} height={63} className="h-full w-full object-contain" />
          </div>
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-line bg-white p-2">
            <Image src="/brand/viralo.jpg" alt="Viralo logo" width={72} height={72} className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Made by Smart Menu & Viralo</p>
            <p className="text-xs text-muted">Sister companies building digital guest experiences.</p>
          </div>
        </div>
        <div className="max-w-xl text-xs leading-relaxed text-muted sm:text-right">
          <p>&copy; {year} Smart Menu and Viralo. All rights reserved.</p>
          <p>DJ Connect and related digital experiences are intellectual property of Smart Menu and Viralo.</p>
        </div>
      </div>
    </footer>
  );
}
