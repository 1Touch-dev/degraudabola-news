'use client';

import { useEffect, useState } from 'react';
import { loadPublicSiteConfig } from '@/lib/public-config';
import {
  fetchLiveMatches,
  fetchUpcoming,
  toLiveScore,
  type LiveScore,
  type MatchCardModel,
} from '@/lib/football-client';
import { getCompetitions } from '@/lib/competitions';

const scoresCache: {
  at: number;
  matches: MatchCardModel[];
} = { at: 0, matches: [] };
const SCORES_TTL_MS = 30_000;

export function useLiveScores(): {
  scores: LiveScore[];
  matches: MatchCardModel[];
  ready: boolean;
  error: boolean;
} {
  const [matches, setMatches] = useState<MatchCardModel[]>(
    scoresCache.matches.length && Date.now() - scoresCache.at < SCORES_TTL_MS
      ? scoresCache.matches
      : []
  );
  const [ready, setReady] = useState(
    scoresCache.matches.length > 0 && Date.now() - scoresCache.at < SCORES_TTL_MS
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fresh = Date.now() - scoresCache.at < SCORES_TTL_MS && scoresCache.matches.length > 0;
    if (fresh) {
      setMatches(scoresCache.matches);
      setReady(true);
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      try {
        await loadPublicSiteConfig();
        if (cancelled) return;
        const live = await fetchLiveMatches({ restrictToPack: true });
        let rows = live.slice(0, 10);
        if (rows.length === 0) {
          const primary = getCompetitions()[0];
          rows = primary ? await fetchUpcoming(primary, 6) : [];
        }
        if (!cancelled) {
          scoresCache.at = Date.now();
          scoresCache.matches = rows;
          setMatches(rows);
          setError(false);
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    matches,
    scores: matches.map(toLiveScore),
    ready,
    error,
  };
}
