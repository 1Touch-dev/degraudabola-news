'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Article } from '@/lib/cms-client';
import { formatRelativeDatePtBr, cn } from '@/lib/utils';

export type ArticleCardVariant = 'lead' | 'horizontal' | 'compact' | 'rail';

interface ArticleCardProps {
  article: Article;
  variant?: ArticleCardVariant;
  rank?: number;
  className?: string;
}

function PlaceholderImage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 bg-[linear-gradient(135deg,rgba(11,61,46,0.10),rgba(125,42,232,0.10))] text-center text-xs font-medium uppercase tracking-wider text-muted',
        className
      )}
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-primary shadow-sm">
        DB
      </span>
      <span>Sem imagem</span>
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
  className,
}: ArticleCardProps) {
  const href = `/artigo/${article.slug}`;
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = !!article.imageUrl && !imageFailed;
  const imageSrc = article.imageUrl || '';

  if (variant === 'lead') {
    return (
      <article
        className={cn(
          'group relative overflow-hidden rounded-[22px] border border-white/10 bg-slate-950 shadow-[0_18px_50px_rgba(15,23,42,0.22)] transition-transform duration-200 ease-out will-change-transform hover:-translate-y-1 motion-reduce:hover:translate-y-0',
          className
        )}
      >
        <Link href={href} className={cn('block', focusRing)}>
          <div className="relative aspect-[16/9] w-full">
            {showImage ? (
              <Image
                src={imageSrc}
                alt=""
                fill
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
                onError={() => setImageFailed(true)}
              />
            ) : (
              <PlaceholderImage className="absolute inset-0" />
            )}
            <div className="absolute inset-0 hidden bg-gradient-to-t from-black via-black/45 to-transparent md:block" />
            <div className="absolute bottom-0 left-0 right-0 hidden p-4 md:block md:p-6">
              <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                {article.category}
              </span>
              {article.isVideo && (
                <span className="ml-2 inline-flex items-center rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-secondary">
                  Vídeo
                </span>
              )}
              <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-white md:text-4xl">
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
          <div className="space-y-3 bg-white p-4 md:hidden">
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              {article.category}
            </span>
            {article.isVideo ? (
              <span className="ml-2 inline-flex items-center rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                Vídeo
              </span>
            ) : null}
            <h2 className="break-words font-heading text-xl font-bold leading-tight text-foreground">
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
      <article className={cn('group rounded-[18px] border border-black/10 bg-white p-3 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]', className)}>
        <Link href={href} className={cn('flex gap-3', focusRing)}>
          <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-[14px] md:h-24 md:w-36">
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
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              {article.category}
            </span>
            <h3 className="mt-2 break-words font-heading text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary md:text-base">
              {article.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{article.excerpt}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-muted">
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
          'group flex items-start gap-3 rounded-2xl border border-black/5 bg-white px-3 py-3 shadow-sm transition-all hover:border-primary/20 hover:bg-primary/5',
          className
        )}
      >
        {rank !== undefined && (
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm text-primary">
            {rank}
          </span>
        )}
        <Link href={href} className={cn('min-w-0 flex-1', focusRing)}>
          <h3 className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {article.title}
          </h3>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted">
            {article.category} · {formatRelativeDatePtBr(article.publishedAt)}
          </p>
        </Link>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'group rounded-[18px] border border-black/10 bg-white p-3 shadow-card transition-all duration-200 ease-out will-change-transform hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)] motion-reduce:hover:translate-y-0',
        className
      )}
    >
      <Link href={href} className={cn('block', focusRing)}>
        <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-[14px]">
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
            <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              Vídeo
            </span>
          )}
        </div>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
          {article.category}
        </span>
        <h3 className="mt-2 font-heading text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-muted">
          {formatRelativeDatePtBr(article.publishedAt)}
        </p>
      </Link>
    </article>
  );
}
