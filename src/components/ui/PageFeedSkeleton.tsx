function Block({ className = '' }: { className?: string }) {
  return <div className={`animate-shimmer rounded-2xl bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%] ${className}`} />;
}

export default function PageFeedSkeleton({
  hero = true,
  sidebar = true,
}: {
  hero?: boolean;
  sidebar?: boolean;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <div className="mb-6 rounded-[22px] border border-black/10 bg-white p-5 shadow-card">
        <Block className="h-4 w-28" />
        <Block className="mt-3 h-8 w-56" />
        <Block className="mt-2 h-4 w-72" />
      </div>

      {hero ? (
        <div className="mb-6 overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-card">
          <Block className="aspect-[16/8] w-full rounded-none" />
        </div>
      ) : null}

      <div className={`grid gap-6 ${sidebar ? 'lg:grid-cols-[minmax(0,1fr)_320px]' : ''}`}>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3 rounded-[20px] border border-black/10 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <Block className="h-20 w-28 shrink-0" />
              <div className="flex-1 space-y-2">
                <Block className="h-3 w-20" />
                <Block className="h-4 w-full" />
                <Block className="h-4 w-4/5" />
                <Block className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
        {sidebar ? (
          <aside className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-[20px] border border-black/10 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                <Block className="h-3 w-20" />
                <Block className="mt-3 h-4 w-full" />
                <Block className="mt-2 h-4 w-3/4" />
              </div>
            ))}
          </aside>
        ) : null}
      </div>
    </div>
  );
}