import { QrCode } from "lucide-react";
import { DarkCard } from "@/components/ui/dark-card";
import { getQrImageUrl } from "@/lib/utils";

export function QRCard({ url, title = "Scan QR" }: { url: string; title?: string }) {
  return (
    <DarkCard id="qr" className="text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[18px] border border-line bg-night text-violet">
        <QrCode size={22} />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-muted">Scan to request songs, vote and see promos</p>
      <div className="mx-auto mt-4 max-w-[260px] rounded-[24px] bg-white p-3">
        <img src={getQrImageUrl(url, 420)} alt="Event QR code" className="h-auto w-full" />
      </div>
      <p className="mt-3 break-all text-xs text-zinc-500">{url}</p>
    </DarkCard>
  );
}
