export function ProgressBar({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
      <div className="h-full rounded-full gradient-button" style={{ width: String(safeValue) + "%" }} />
    </div>
  );
}
