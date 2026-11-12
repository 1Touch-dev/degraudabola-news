'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLiveScores } from '@/lib/football-hooks';
import { DURATION, scoreUpdateFlash, transition } from '@/lib/motion';
import MatchCard from '@/components/football/MatchCard';

function ScoreboardSkeleton() {
  return (
    <section aria-label="Carregando placar" role="status">
      <div className="mb-3 flex items-end justify-between gap-3 border-b border-black/10 pb-3">
        <div className="space-y-2">
          <div className="h-3 w-24 animate-shimmer rounded bg-black/5" />
          <div className="h-5 w-36 animate-shimmer rounded bg-black/5" />
        </div>
        <div className="h-10 w-36 animate-shimmer rounded bg-black/5" />
      </div>
      <div className="flex gap-2 overflow-hidden border border-black/10 bg-surface p-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="min-w-[220px] border border-black/5 bg-white p-4">
            <div className="h-3 w-16 animate-shimmer rounded bg-black/5" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full animate-shimmer rounded bg-black/5" />
              <div className="h-4 w-5/6 animate-shimmer rounded bg-black/5" />
            </div>
            <div className="mt-4 h-8 w-20 animate-shimmer rounded bg-black/5" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ScoreboardStrip() {
  const reduced = useReducedMotion();
  const { matches, ready, error } = useLiveScores();
  if (!ready) return <ScoreboardSkeleton />;
  if (error && matches.length === 0) {
    return (
      <section aria-label="Placar" className="border border-black/10 bg-surface p-4 text-center">
        <p className="text-sm font-medium text-secondary">Placar temporariamente indisponível</p>
        <p className="mt-1 text-xs text-muted">Atualize em instantes.</p>
      </section>
    );
  }
  if (matches.length === 0) {
    return (
      <section
        aria-label="Placar"
        className="border border-dashed border-black/15 bg-surface/80 p-4 text-center"
      >
        <p className="text-sm font-medium text-secondary">Sem partidas no momento</p>
        <Link
          href="/futebol"
          className="mt-2 inline-flex text-xs font-bold uppercase tracking-[0.16em] text-primary hover:underline"
        >
          Ver calendário
        </Link>
      </section>
    );
  }
  const hasLive = matches.some((m) => m.statusKind === 'live');
  return (
    <section aria-label="Placar">
      <div className="mb-3 flex items-end justify-between gap-3 border-b border-black/10 pb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">Iluminados</p>
          <h2 className="mt-1 font-display text-2xl uppercase tracking-wide text-secondary">
            Placar da rodada
          </h2>
        </div>
        <Link
          href={hasLive ? '/ao-vivo' : '/futebol'}
          className="inline-flex min-h-10 items-center border border-primary/20 bg-primary/5 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {hasLive ? 'Ver ao vivo' : 'Central de partidas'}
        </Link>
      </div>
      <div className="max-w-full overflow-x-auto border border-pitch-night/40 bg-[linear-gradient(135deg,#071A14_0%,#146C43_55%,#0F2A20_100%)] p-1 text-white shadow-elevated scrollbar-hide">
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
