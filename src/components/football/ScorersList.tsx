'use client';

import { useState } from 'react';
import type { ScorerRow } from '@/lib/football-client';

function TeamLogoBadge({ team, logo }: { team?: string; logo?: string }) {
  const [failed, setFailed] = useState(false);
  const short = (team || 'Clube').replace(/[^A-Za-zÀ-ÿ]/g, '').slice(0, 3).toUpperCase();

  if (!logo || failed) {
    return (
      <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-primary/10 text-[8px] font-bold uppercase text-primary">
        {short}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo}
      alt=""
      width={22}
      height={22}
      className="h-[22px] w-[22px] object-contain"
      onError={() => setFailed(true)}
    />
  );
}

export default function ScorersList({ rows }: { rows: ScorerRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-black/10 bg-white px-4 py-8 text-sm text-muted">
        Artilharia ainda não disponível.
      </p>
    );
  }

  return (
    <ol className="divide-y divide-black/[0.06] rounded-xl border border-black/10 bg-white">
      {rows.map((row) => (
        <li
          key={`${row.rank}-${row.name}`}
          className="flex items-center gap-3 px-4 py-3"
        >
          <span className="w-6 text-right text-xs tabular-nums text-muted">
            {row.rank}
          </span>
          <TeamLogoBadge team={row.team} logo={row.teamLogo} />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold text-secondary">
              {row.name}
            </span>
            {row.team ? (
              <span className="block truncate text-xs text-muted">{row.team}</span>
            ) : null}
          </span>
          <span className="font-display text-xl tabular-nums text-secondary">
            {row.goals}
          </span>
        </li>
      ))}
    </ol>
  );
}
