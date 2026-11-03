'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/lib/site-config';
import type { Article } from '@/lib/cms-client';
import FallbackMedia from '@/components/ui/FallbackMedia';

const POPULAR = ['Série B', 'Tabela', 'Partidas', 'Clubes', 'Transferências'];
const RECENT_KEY = 'degraudabola:recent-searches';

function SearchRow({ article, onOpen }: { article: Article; onOpen: (term: string) => void }) {
  return (
    <Link
      href={`/artigo/${article.slug}`}
      onClick={() => onOpen(article.title)}
      className="flex items-start gap-3 rounded-2xl border border-black/8 bg-white px-3 py-3 transition hover:border-primary/25 hover:bg-primary/5"
    >
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        <FallbackMedia
          src={article.imageUrl}
          alt=""
          fill
          sizes="80px"
          className="object-cover"
          fallbackClassName="absolute inset-0"
          label="DB"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
              {article.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
              {article.excerpt}
            </p>
          </div>
          <span className="shrink-0 rounded bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            {article.category}
          </span>
        </div>
      </div>
    </Link>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-live="polite" aria-label="Carregando resultados">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-start gap-3 rounded-2xl border border-black/8 bg-white px-3 py-3">
          <div className="h-16 w-20 shrink-0 rounded-xl bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%] animate-shimmer" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-4/5 rounded bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%] animate-shimmer" />
            <div className="h-3 w-full rounded bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%] animate-shimmer" />
            <div className="h-3 w-3/4 rounded bg-[linear-gradient(90deg,rgba(15,23,42,0.05),rgba(255,255,255,0.75),rgba(15,23,42,0.05))] bg-[length:200%_100%] animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setRecent(parsed.filter((item): item is string => typeof item === 'string').slice(0, 6));
      }
    } catch {
      /* ignore storage issues */
    }
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((v) => !v);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!open || trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&limit=6`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Search failed');
        const data = (await res.json()) as { results?: Article[] };
        setResults(Array.isArray(data.results) ? data.results : []);
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [open, query]);

  const suggestions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const base = [...POPULAR, ...recent, ...siteConfig.navCategories.map((cat) => cat.name)];
    const unique = Array.from(new Set(base));
    if (!needle) return unique.slice(0, 8);
    return unique.filter((item) => item.toLowerCase().includes(needle)).slice(0, 8);
  }, [query, recent]);

  const persistRecent = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    const next = [normalized, ...recent.filter((item) => item.toLowerCase() !== normalized.toLowerCase())].slice(0, 6);
    setRecent(next);
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore storage issues */
    }
  };

  const submitSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    persistRecent(trimmed);
    setOpen(false);
    router.push(`/busca?q=${encodeURIComponent(trimmed)}`);
  };

  const showResults = query.trim().length >= 2;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white hover:text-[#0B3D2E]"
        aria-label="Abrir busca"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        Buscar
        <span className="hidden rounded-full border border-white/20 px-2 py-1 text-[10px] tracking-[0.18em] md:inline-flex">
          Ctrl K
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/55 p-4 pt-20 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[24px] border border-white/10 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.25)]">
            <div className="border-b border-black/10 bg-[linear-gradient(135deg,rgba(11,61,46,0.98),rgba(22,101,52,0.92)_100%)] p-5 text-white md:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-200">Busca</p>
                  <h2 className="mt-1 font-display text-2xl uppercase tracking-wide">Encontre notícias</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-10 items-center rounded-full border border-white/15 bg-white/10 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white hover:text-[#0B3D2E]"
                >
                  Fechar
                </button>
              </div>

              <form
                action="/busca"
                method="get"
                className="mt-5 flex flex-col gap-3 md:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  submitSearch();
                }}
              >
                <div className="relative flex-1">
                  <input
                    type="search"
                    name="q"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Digite palavras-chave..."
                    autoFocus
                    className="min-h-14 w-full rounded-full border border-white/20 bg-white px-5 pr-12 text-lg text-secondary outline-none placeholder:text-slate-500"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-primary/80 hover:text-primary"
                      aria-label="Limpar busca"
                    >
                      ×
                    </button>
                  ) : null}
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-5 text-xs font-bold uppercase tracking-[0.18em] text-[#0B3D2E] hover:bg-emerald-50"
                >
                  Buscar
                </button>
              </form>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-4 md:p-5">
              {showResults ? (
                <div>
                  <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Resultados</p>
                    <button
                      type="button"
                      onClick={submitSearch}
                      className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary hover:underline"
                    >
                      Ver todos
                    </button>
                  </div>

                  {loading ? (
                    <SearchResultsSkeleton />
                  ) : results.length ? (
                    <div className="space-y-3">
                      {results.map((article) => (
                        <SearchRow
                          key={article.id}
                          article={article}
                          onOpen={(term) => {
                            persistRecent(term);
                            setOpen(false);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[22px] border border-black/10 bg-slate-50 p-6 text-center">
                      <p className="text-sm font-medium text-secondary">Nenhuma notícia encontrada.</p>
                      <p className="mt-2 text-sm text-muted">Tente outro termo.</p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {suggestions.slice(0, 4).map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => setQuery(term)}
                            className="inline-flex min-h-10 items-center rounded-full border border-black/10 bg-white px-4 text-xs font-semibold text-secondary hover:border-primary hover:text-primary"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Sugestões</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.slice(0, 8).map((term) => (
                      <button
                        key={`suggest-${term}`}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="inline-flex min-h-10 items-center rounded-full border border-black/10 bg-slate-50 px-4 text-xs font-semibold text-secondary hover:border-primary hover:text-primary"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}