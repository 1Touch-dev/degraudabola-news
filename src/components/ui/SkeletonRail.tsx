'use client';

import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonRailProps {
  rows?: number;
  className?: string;
  label?: string;
}

/** Loading placeholder for article rails — static when reduced motion. */
export default function SkeletonRail({
  rows = 4,
  className,
  label = 'Carregando…',
}: SkeletonRailProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        'rounded-[20px] border border-black/10 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className={cn(
          'mb-4 h-4 w-28 rounded-full bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%]',
          !reduced && 'animate-shimmer'
        )}
      />
      <ul className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i} className="flex gap-3 rounded-[18px] border border-black/5 bg-black/[0.02] p-3">
            <div
              className={cn(
                'h-14 w-20 shrink-0 rounded-[14px] bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%]',
                !reduced && 'animate-shimmer'
              )}
            />
            <div className="flex-1 space-y-2 py-1">
              <div
                className={cn(
                  'h-3 w-full rounded-full bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%]',
                  !reduced && 'animate-shimmer'
                )}
              />
              <div
                className={cn(
                  'h-3 w-2/3 rounded-full bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%]',
                  !reduced && 'animate-shimmer'
                )}
              />
            </div>
          </li>
        ))}
      </ul>
      <span className="sr-only">{label}</span>
    </div>
  );
}
