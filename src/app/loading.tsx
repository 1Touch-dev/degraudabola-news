function PulseBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-shimmer rounded bg-black/5 ${className}`} />;
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-5 px-3 py-5 md:px-4 md:py-7">
      <section className="overflow-hidden border border-black/10 bg-pitch-night p-5 text-white md:p-8">
        <PulseBlock className="h-3 w-40 bg-white/10" />
        <PulseBlock className="mt-4 h-12 w-4/5 bg-white/10" />
        <PulseBlock className="mt-3 h-4 w-2/3 bg-white/10" />
        <div className="mt-6 grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <PulseBlock key={i} className="h-20 bg-white/10" />
          ))}
        </div>
      </section>

      <section className="overflow-hidden border border-black/10 bg-pitch-night">
        <PulseBlock className="aspect-[21/9] w-full rounded-none bg-white/10" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <div className="border border-black/10 bg-surface p-5">
            <PulseBlock className="h-4 w-36" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 border border-black/5 p-3">
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
          <div className="border border-black/10 bg-surface p-5">
            <PulseBlock className="h-4 w-28" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-2">
                  <PulseBlock className="h-8 w-8 shrink-0" />
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
