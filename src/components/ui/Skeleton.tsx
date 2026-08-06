export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-black/[0.06] dark:bg-white/10 ${className}`}
    />
  );
}
