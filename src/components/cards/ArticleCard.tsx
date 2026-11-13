'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Article } from '@/lib/cms-client';
import { formatRelativeDatePtBr, cn } from '@/lib/utils';

export type ArticleCardVariant = 'lead' | 'horizontal' | 'compact' | 'rail';
export type ArticleCardTone = 'light' | 'dark';

interface ArticleCardProps {
  article: Article;
  variant?: ArticleCardVariant;
  rank?: number;
  tone?: ArticleCardTone;
  className?: string;
}

function PlaceholderImage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#071A14_0%,#146C43_60%,#0F2A20_100%)] text-center',
        className
      )}
    >
      <Image
        src="/logo.png"
        alt=""
        width={72}
        height={72}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.18]"
        aria-hidden
      />
      <span className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
        Sem imagem
      </span>
    </div>
  );
}

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

/** Card chrome — transform-only hover (no shadow storms). LCP lead image never fades in. */
export default function ArticleCard({
  article,
  variant = 'compact',
  rank,
  tone = 'light',
  className,
}: ArticleCardProps) {
  const href = `/artigo/${article.slug}`;
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = !!article.imageUrl && !imageFailed;
  const imageSrc = article.imageUrl || '';
  const dark = tone === 'dark';

  if (variant === 'lead') {
    return (
      <article
        className={cn(
          'group relative overflow-hidden border border-black/15 bg-pitch-night shadow-elevated transition-transform duration-200 ease-out will-change-transform hover:-translate-y-1 motion-reduce:hover:translate-y-0',
          className
        )}
      >
        <Link href={href} className={cn('block', focusRing)}>
          <div className="relative aspect-[16/9] w-full bg-pitch-night">
            {showImage ? (
              <Image
                src={imageSrc}
                alt=""
                fill
                className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
                onError={() => setImageFailed(true)}
              />
            ) : (
              <PlaceholderImage className="absolute inset-0" />
            )}
            <div className="absolute inset-0 hidden bg-gradient-to-t from-pitch-night via-pitch-night/55 to-transparent md:block" />
            <div className="absolute bottom-0 left-0 right-0 hidden p-4 md:block md:p-6">
              <span className="inline-flex items-center bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-pitch-night">
                {article.category}
              </span>
              {article.isVideo && (
                <span className="ml-2 inline-flex items-center bg-live px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                  Vídeo
                </span>
              )}
              <h2 className="mt-3 font-display text-3xl uppercase leading-none tracking-wide text-white md:text-5xl">
                {article.title}
              </h2>
              <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
                {article.excerpt}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/60">
                {article.author} · {formatRelativeDatePtBr(article.publishedAt)}
              </p>
            </div>
          </div>
          <div className="space-y-3 bg-surface p-4 md:hidden">
            <span className="inline-flex items-center bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              {article.category}
            </span>
            {article.isVideo ? (
              <span className="ml-2 inline-flex items-center bg-live px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                Vídeo
              </span>
            ) : null}
            <h2 className="break-words font-display text-2xl uppercase leading-none text-foreground">
              {article.title}
            </h2>
            <p className="line-clamp-3 text-sm text-muted">{article.excerpt}</p>
            <p className="text-xs text-muted">
              {article.author} · {formatRelativeDatePtBr(article.publishedAt)}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article
        className={cn(
          'group p-3 transition-all hover:-translate-y-0.5',
          dark
            ? 'border border-white/12 bg-white/[0.04] hover:border-accent/45 hover:bg-white/[0.07]'
            : 'border border-black/10 bg-surface shadow-card hover:border-primary/40',
          className
        )}
      >
        <Link href={href} className={cn('flex gap-3', focusRing)}>
          <span
            className={cn(
              'relative h-20 w-28 shrink-0 overflow-hidden bg-pitch-night md:h-24 md:w-36',
              dark ? 'border border-white/10' : 'border border-black/5'
            )}
          >
            {showImage ? (
              <Image
                src={imageSrc}
                alt=""
                fill
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                sizes="144px"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <PlaceholderImage className="h-full w-full" />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]',
                dark ? 'bg-accent/15 text-accent' : 'bg-primary/10 text-primary'
              )}
            >
              {article.category}
            </span>
            <h3
              className={cn(
                'mt-2 break-words font-heading text-base font-semibold leading-snug transition-colors md:text-lg',
                dark
                  ? 'text-white group-hover:text-accent'
                  : 'text-foreground group-hover:text-primary'
              )}
            >
              {article.title}
            </h3>
            <p
              className={cn(
                'mt-1.5 line-clamp-2 text-xs leading-relaxed',
                dark ? 'text-white/60' : 'text-muted'
              )}
            >
              {article.excerpt}
            </p>
            <p
              className={cn(
                'mt-2 text-[10px] uppercase tracking-[0.16em]',
                dark ? 'text-white/40' : 'text-muted'
              )}
            >
              {formatRelativeDatePtBr(article.publishedAt)}
              {article.isVideo && ' · Vídeo'}
            </p>
          </span>
        </Link>
      </article>
    );
  }

  if (variant === 'rail') {
    return (
      <article
        className={cn(
          'group flex items-start gap-3 border border-transparent bg-transparent px-3 py-3 transition-all',
          dark
            ? 'hover:border-accent/25 hover:bg-white/[0.04]'
            : 'hover:border-primary/20 hover:bg-primary/[0.04]',
          className
        )}
      >
        {rank !== undefined && (
          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center border border-accent/40 bg-pitch-night font-display text-lg text-accent">
            {rank}
          </span>
        )}
        <Link href={href} className={cn('min-w-0 flex-1', focusRing)}>
          <h3
            className={cn(
              'font-heading text-base font-semibold leading-snug transition-colors',
              dark
                ? 'text-white group-hover:text-accent'
                : 'text-foreground group-hover:text-primary'
            )}
          >
            {article.title}
          </h3>
          <p className={cn('mt-1 text-[10px] uppercase tracking-[0.16em]', dark ? 'text-white/45' : 'text-muted')}>
            {article.category} · {formatRelativeDatePtBr(article.publishedAt)}
          </p>
        </Link>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'group p-3 transition-all duration-200 ease-out will-change-transform hover:-translate-y-1 motion-reduce:hover:translate-y-0',
        dark
          ? 'border border-white/12 bg-white/[0.04] hover:border-accent/45'
          : 'border border-black/10 bg-surface shadow-card',
        className
      )}
    >
      <Link href={href} className={cn('block', focusRing)}>
        <div
          className={cn(
            'relative mb-3 aspect-[4/3] overflow-hidden bg-pitch-night',
            dark ? 'border border-white/10' : 'border border-black/5'
          )}
        >
          {showImage ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
              sizes="(max-width: 768px) 50vw, 25vw"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <PlaceholderImage className="h-full w-full" />
          )}
          {article.isVideo && (
            <span className="absolute bottom-2 left-2 bg-live px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              Vídeo
            </span>
          )}
        </div>
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]',
            dark ? 'bg-accent/15 text-accent' : 'bg-primary/10 text-primary'
          )}
        >
          {article.category}
        </span>
        <h3
          className={cn(
            'mt-2 font-heading text-base font-semibold leading-snug transition-colors',
            dark
              ? 'text-white group-hover:text-accent'
              : 'text-foreground group-hover:text-primary'
          )}
        >
          {article.title}
        </h3>
        <p className={cn('mt-2 text-[10px] uppercase tracking-[0.16em]', dark ? 'text-white/40' : 'text-muted')}>
          {formatRelativeDatePtBr(article.publishedAt)}
        </p>
      </Link>
    </article>
  );
}
