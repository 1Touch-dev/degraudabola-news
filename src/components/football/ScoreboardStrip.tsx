'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLiveScores } from '@/lib/football-hooks';
import { DURATION, scoreUpdateFlash, transition } from '@/lib/motion';
import MatchCard from '@/components/football/MatchCard';

function ScoreboardSkeleton() {
  return (
    <section aria-label="Carregando placar" role="status">
      <div className="mb-3 flex items-end justify-between gap-3 border-b border-black/5 pb-3">
        <div className="space-y-2">
          <div className="animate-shimmer h-3 w-24 rounded-full bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%]" />
          <div className="animate-shimmer h-5 w-28 rounded-full bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%]" />
        </div>
        <div className="animate-shimmer h-10 w-36 rounded-full bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%]" />
      </div>
      <div className="flex gap-2 overflow-hidden rounded-[24px] border border-emerald-950/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(240,253,244,0.92))] p-2 shadow-[0_18px_40px_rgba(11,61,46,0.10)]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="min-w-[220px] rounded-[20px] border border-black/5 bg-white/80 p-4 backdrop-blur-sm">
            <div className="animate-shimmer h-3 w-16 rounded-full bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%]" />
            <div className="mt-4 space-y-2">
              <div className="animate-shimmer h-4 w-full rounded-full bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%]" />
              <div className="animate-shimmer h-4 w-5/6 rounded-full bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%]" />
            </div>
            <div className="mt-4 animate-shimmer h-8 w-20 rounded-full bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%]" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ScoreboardStrip() {
  const reduced = useReducedMotion();
  const { matches, ready } = useLiveScores();
  if (!ready) return <ScoreboardSkeleton />;
  if (matches.length === 0) return null;
  const hasLive = matches.some((m) => m.statusKind === 'live');
  return (
    <section aria-label="Placar">
      <div className="mb-3 flex items-end justify-between gap-3 border-b border-black/5 pb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">Match Center</p>
          <h2 className="mt-1 font-display text-xl uppercase tracking-wide text-secondary">
            Placar
          </h2>
        </div>
        <Link
          href={hasLive ? '/ao-vivo' : '/futebol'}
          className="inline-flex min-h-10 items-center rounded-full border border-primary/20 bg-primary/5 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {hasLive ? 'Ver ao vivo' : 'Central de partidas'}
        </Link>
      </div>
      <div className="max-w-full overflow-x-auto rounded-[22px] border border-emerald-950/40 bg-[linear-gradient(135deg,#0B3D2E_0%,#0E5A43_55%,#083526_100%)] p-1 text-white shadow-[0_20px_50px_rgba(11,61,46,0.28)] scrollbar-hide">
        <div className="flex min-w-max gap-1">
          {matches.map((match) => (
            <motion.div
              key={match.id}
              variants={scoreUpdateFlash}
              initial="idle"
              whileHover={reduced ? undefined : 'flash'}
              layout={!reduced}
              transition={transition(DURATION.fast, !!reduced)}
              className="min-w-[220px]"
            >
              <MatchCard match={match} variant="compact" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
