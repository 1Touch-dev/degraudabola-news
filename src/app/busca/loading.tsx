function Block({ className = '' }: { className?: string }) {
  return <div className={`rounded-2xl bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%] animate-shimmer ${className}`} />;
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-10">
      <div className="mb-6 rounded-[22px] border border-black/10 bg-white p-5 shadow-card">
        <Block className="h-4 w-20" />
        <Block className="mt-3 h-8 w-64" />
        <Block className="mt-2 h-4 w-80 max-w-full" />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Block className="h-12 flex-1 rounded-full" />
        <Block className="h-12 w-32 rounded-full" />
      </div>

      <Block className="mb-4 h-4 w-56" />

      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-start gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <Block className="h-20 w-28 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Block className="h-5 w-20" />
              <Block className="h-5 w-full" />
              <Block className="h-5 w-4/5" />
              <Block className="h-4 w-full" />
              <Block className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}