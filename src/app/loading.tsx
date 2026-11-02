function PulseBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-shimmer rounded-2xl bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%] ${className}`} />;
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 md:py-8">
      <section className="overflow-hidden rounded-[24px] border border-black/10 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:p-5">
        <div className="grid gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[20px] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(248,250,252,0.95))] p-4">
              <PulseBlock className="h-3 w-24" />
              <PulseBlock className="mt-3 h-4 w-full" />
              <PulseBlock className="mt-2 h-4 w-4/5" />
              <PulseBlock className="mt-4 h-3 w-20" />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <PulseBlock className="aspect-[16/8] w-full rounded-none" />
            <div className="space-y-3 p-5">
              <PulseBlock className="h-3 w-24" />
              <PulseBlock className="h-8 w-4/5" />
              <PulseBlock className="h-4 w-full" />
              <PulseBlock className="h-4 w-2/3" />
            </div>
          </div>

          <div className="rounded-[22px] border border-black/10 bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.07)]">
            <PulseBlock className="h-4 w-36" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 rounded-[18px] border border-black/5 bg-black/[0.02] p-3">
                  <PulseBlock className="h-20 w-28 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <PulseBlock className="h-3 w-20" />
                    <PulseBlock className="h-4 w-full" />
                    <PulseBlock className="h-4 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[22px] border border-black/10 bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.07)]">
            <PulseBlock className="h-4 w-28" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 rounded-2xl border border-black/5 p-3">
                  <PulseBlock className="h-8 w-8 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <PulseBlock className="h-4 w-full" />
                    <PulseBlock className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}