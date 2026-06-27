import { DarkCard } from "@/components/ui/dark-card";

export function ErrorState({ title = "Something went wrong", text }: { title?: string; text?: string }) {
  return (
    <DarkCard className="border-rose-500/30 bg-rose-500/10">
      <h3 className="text-base font-semibold text-rose-100">{title}</h3>
      {text ? <p className="mt-1 text-sm text-rose-100/80">{text}</p> : null}
    </DarkCard>
  );
}
