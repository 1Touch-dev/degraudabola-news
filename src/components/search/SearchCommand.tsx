'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { siteConfig } from '@/lib/site-config';

const POPULAR = ['Série B', 'Tabela', 'Partidas', 'Clubes', 'Transferências'];
const RECENT_KEY = 'degraudabola:recent-searches';

export default function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);

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

  const quickLinks = useMemo(
    () => [
      ...POPULAR.map((term) => ({ href: `/busca?q=${encodeURIComponent(term)}`, label: term })),
      ...siteConfig.navCategories.slice(0, 5).map((cat) => ({ href: `/categoria/${cat.slug}`, label: cat.name })),
    ],
    []
  );

  const suggestions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const base = [
      ...POPULAR,
      ...recent,
      ...siteConfig.navCategories.map((cat) => cat.name),
    ];
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
          <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.25)]">
            <div className="border-b border-black/10 bg-[linear-gradient(135deg,rgba(11,61,46,0.98),rgba(22,101,52,0.96))] p-4 text-white md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-200">Busca rápida</p>
                  <h2 className="mt-1 font-display text-2xl uppercase tracking-wide">Encontre notícias</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-white hover:text-[#0B3D2E]"
                >
                  Fechar
                </button>
              </div>
              <form action="/busca" method="get" className="mt-4 flex flex-col gap-3 md:flex-row">
                <input
                  autoFocus
                  type="search"
                  name="q"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar clubes, tabela, jogadores, rodadas..."
                  className="min-h-12 flex-1 rounded-full border border-white/10 bg-white px-5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-white focus:outline-none"
                />
                <button
                  type="submit"
                  onClick={() => persistRecent(query)}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 text-xs font-bold uppercase tracking-[0.18em] text-[#0B3D2E] hover:bg-emerald-50"
                >
                  Buscar agora
                </button>
              </form>
            </div>

            <div className="grid gap-5 p-4 md:grid-cols-[1.2fr_0.8fr] md:p-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Sugestões</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestions.map((term) => (
                    <Link
                      key={`suggest-${term}`}
                      href={`/busca?q=${encodeURIComponent(term)}`}
                      onClick={() => {
                        persistRecent(term);
                        setOpen(false);
                      }}
                      className="inline-flex min-h-10 items-center rounded-full border border-black/10 bg-white px-4 text-xs font-semibold text-secondary hover:border-primary hover:text-primary"
                    >
                      {term}
                    </Link>
                  ))}
                </div>

                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Pesquisas populares</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {POPULAR.map((term) => (
                    <Link
                      key={term}
                      href={`/busca?q=${encodeURIComponent(term)}`}
                      onClick={() => {
                        persistRecent(term);
                        setOpen(false);
                      }}
                      className="inline-flex min-h-10 items-center rounded-full border border-black/10 bg-slate-50 px-4 text-xs font-semibold text-secondary hover:border-primary hover:text-primary"
                    >
                      {term}
                    </Link>
                  ))}
                </div>

                {recent.length ? (
                  <>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Recentes</p>
                      <button
                        type="button"
                        onClick={() => {
                          setRecent([]);
                          try {
                            window.localStorage.removeItem(RECENT_KEY);
                          } catch {
                            /* ignore storage issues */
                          }
                        }}
                        className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted hover:text-primary"
                      >
                        Limpar
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {recent.map((term) => (
                        <Link
                          key={`recent-${term}`}
                          href={`/busca?q=${encodeURIComponent(term)}`}
                          onClick={() => {
                            persistRecent(term);
                            setOpen(false);
                          }}
                          className="inline-flex min-h-10 items-center rounded-full border border-black/10 bg-slate-50 px-4 text-xs font-semibold text-secondary hover:border-primary hover:text-primary"
                        >
                          {term}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Acessos rápidos</p>
                <div className="mt-3 space-y-2">
                  {quickLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm font-medium text-secondary hover:border-primary hover:text-primary"
                    >
                      <span>{item.label}</span>
                      <span aria-hidden>→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}