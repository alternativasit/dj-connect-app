export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] border border-line bg-surface p-4 text-sm text-muted">
      <span className="h-3 w-3 animate-pulse rounded-full bg-violet" />
      {label}
    </div>
  );
}
