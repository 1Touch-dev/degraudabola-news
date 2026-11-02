function Block({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-black/10 ${className}`} />;
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <Block className="aspect-[16/8] w-full rounded-[24px]" />
      <div className="mx-auto mt-8 max-w-3xl space-y-4">
        <Block className="h-3 w-24" />
        <Block className="h-10 w-5/6" />
        <Block className="h-4 w-2/3" />
        <Block className="h-4 w-1/2" />
        <div className="space-y-3 pt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Block key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}