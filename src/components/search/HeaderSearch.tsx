'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Article } from '@/lib/cms-client';
import FallbackMedia from '@/components/ui/FallbackMedia';
import { cn } from '@/lib/utils';

const CACHE = new Map<string, { at: number; results: Article[] }>();
const CACHE_TTL = 45_000;

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export default function HeaderSearch({
  className,
  compact = false,
  iconOnly = false,
}: {
  className?: string;
  compact?: boolean;
  iconOnly?: boolean;
}) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(!iconOnly);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Article[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        if (iconOnly) setExpanded(false);
      }
    };
    window.addEventListener('mousedown', onPointer);
    return () => window.removeEventListener('mousedown', onPointer);
  }, [iconOnly]);

  useEffect(() => {
    if (expanded && iconOnly) {
      inputRef.current?.focus();
    }
  }, [expanded, iconOnly]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      setError(false);
      return;
    }

    const cached = CACHE.get(trimmed.toLowerCase());
    if (cached && Date.now() - cached.at < CACHE_TTL) {
      setResults(cached.results);
      setLoading(false);
      setError(false);
      setOpen(true);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError(false);
        setOpen(true);
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&limit=6`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('search failed');
        const data = (await res.json()) as { results?: Article[] };
        const next = Array.isArray(data.results) ? data.results : [];
        CACHE.set(trimmed.toLowerCase(), { at: Date.now(), results: next });
        setResults(next);
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 240);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  const submit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    if (iconOnly) setExpanded(false);
    router.push(`/busca?q=${encodeURIComponent(trimmed)}`);
  };

  const resultsPanel =
    open && query.trim().length >= 2 ? (
      <div
        id={listId}
        role="listbox"
        className={cn(
          'z-[80] overflow-hidden rounded-lg border border-black/10 bg-surface shadow-elevated',
          iconOnly
            ? 'absolute left-0 right-0 top-full mt-2 w-auto'
            : 'absolute right-0 mt-2 w-[min(100vw-2rem,22rem)] sm:w-[26rem]'
        )}
      >
        <div className="border-b border-black/8 bg-[linear-gradient(90deg,rgba(20,108,67,0.08),transparent)] px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Resultados rápidos
          </p>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {loading ? (
            <div className="space-y-2" role="status" aria-label="Carregando busca">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex gap-3 rounded-md p-2">
                  <div className="h-14 w-16 animate-shimmer rounded bg-black/5" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 w-4/5 animate-shimmer rounded bg-black/5" />
                    <div className="h-3 w-2/3 animate-shimmer rounded bg-black/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-md bg-black/[0.03] px-3 py-6 text-center">
              <p className="text-sm font-medium text-secondary">Falha na busca</p>
              <p className="mt-1 text-xs text-muted">Tente novamente em instantes.</p>
            </div>
          ) : results.length ? (
            <ul className="space-y-1">
              {results.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/artigo/${article.slug}`}
                    role="option"
                    onClick={() => {
                      setOpen(false);
                      if (iconOnly) setExpanded(false);
                    }}
                    className="flex gap-3 rounded-md p-2 transition hover:bg-primary/5"
                  >
                    <span className="relative h-14 w-16 shrink-0 overflow-hidden rounded bg-black/5">
                      <FallbackMedia
                        src={article.imageUrl}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                        fallbackClassName="absolute inset-0"
                        label="DB"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                        {article.title}
                      </span>
                      <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-muted">
                        {article.category}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-md bg-black/[0.03] px-3 py-6 text-center">
              <p className="text-sm font-medium text-secondary">Nenhum resultado</p>
              <p className="mt-1 text-xs text-muted">Ajuste o termo e tente de novo.</p>
            </div>
          )}
        </div>

        <div className="border-t border-black/8 p-2">
          <button
            type="button"
            onClick={submit}
            className="flex min-h-10 w-full items-center justify-center rounded-md bg-secondary text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-primary"
          >
            Ver todos em Busca
          </button>
        </div>
      </div>
    ) : null;

  if (iconOnly && !expanded) {
    return (
      <div ref={rootRef} className={cn('relative shrink-0', className)}>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="inline-flex size-9 items-center justify-center rounded-md border border-white/15 bg-white/10 text-accent hover:bg-white/15"
          aria-label="Abrir busca"
        >
          <SearchIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative min-w-0',
        iconOnly && 'absolute inset-x-3 top-1.5 z-[70]',
        className
      )}
    >
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className={cn(
          'flex items-center gap-2 rounded-md border border-white/15 bg-pitch-night shadow-elevated backdrop-blur-sm',
          iconOnly ? 'min-h-10 border-accent/30 bg-pitch-night px-2.5' : '',
          !iconOnly && (compact ? 'min-h-10 bg-white/10 px-2.5' : 'min-h-11 bg-white/10 px-3')
        )}
      >
        <SearchIcon className="h-4 w-4 shrink-0 text-accent" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2 || results.length) setOpen(true);
          }}
          placeholder="Buscar..."
          aria-autocomplete="list"
          aria-controls={listId}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45',
            !iconOnly && (compact ? 'w-28 lg:w-44' : 'w-36 lg:w-56')
          )}
        />
        {iconOnly ? (
          <button
            type="button"
            onClick={() => {
              setExpanded(false);
              setOpen(false);
            }}
            className="rounded px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70 hover:text-white"
            aria-label="Fechar busca"
          >
            Fechar
          </button>
        ) : (
          <button
            type="submit"
            className="hidden rounded px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-pitch-night bg-accent hover:bg-white sm:inline-flex"
          >
            Ir
          </button>
        )}
      </form>

      {resultsPanel}
    </div>
  );
}
