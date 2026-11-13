'use client';

import { useEffect, useState } from 'react';
import HtmlBannerFrame from '@/components/cms/HtmlBannerFrame';
import BrandFallback from '@/components/ui/BrandFallback';
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/utils';

const ROTATE_MS = 7000;

export type EditorialSlide = {
  id: string;
  kind: 'hero' | 'html' | 'image';
  title: string;
  html?: string;
  image?: string;
  href?: string;
  external?: boolean;
  excerpt?: string;
  category?: string;
  meta?: string;
  ctaLabel?: string;
};

function HeroMedia({
  slide,
  priority,
}: {
  slide: EditorialSlide;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(slide.image) && !failed;

  useEffect(() => {
    setFailed(false);
  }, [slide.id, slide.image]);

  return (
    <div className="relative h-full min-h-[200px] w-full overflow-hidden bg-pitch-night sm:min-h-[240px] md:min-h-0">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
        />
      ) : (
        <BrandFallback className="absolute inset-0" labeled />
      )}
    </div>
  );
}

function HeroSlide({ slide, priority }: { slide: EditorialSlide; priority?: boolean }) {
  const cta = slide.ctaLabel || 'Ler reportagem completa';
  const eyebrow = slide.category
    ? `${slide.category} · Destaque`
    : `${siteConfig.siteName} · Destaque`;

  const body = (
    <article className="grid min-h-0 overflow-hidden border border-white/10 bg-[color-mix(in_srgb,var(--color-pitch-night)_92%,white)] text-white md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <div className="order-2 flex flex-col justify-center gap-3 px-4 py-5 sm:gap-4 sm:px-6 sm:py-7 md:order-1 md:px-8 md:py-9 lg:px-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent sm:text-[11px]">
          {eyebrow}
        </p>
        <h2 className="font-display text-[1.55rem] uppercase leading-[0.95] tracking-wide text-balance sm:text-3xl md:text-4xl lg:text-[2.65rem]">
          {slide.title}
        </h2>
        {slide.excerpt ? (
          <p className="line-clamp-3 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            {slide.excerpt}
          </p>
        ) : null}
        <div className="mt-1 h-px w-full max-w-md bg-white/15" aria-hidden />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
            {cta}
            <span aria-hidden>↗</span>
          </span>
          {slide.meta ? (
            <span className="text-[11px] tracking-wide text-white/55 sm:text-xs">{slide.meta}</span>
          ) : null}
        </div>
      </div>
      <div className="order-1 aspect-[16/10] md:order-2 md:aspect-auto md:min-h-[280px] lg:min-h-[320px]">
        <HeroMedia slide={slide} priority={priority} />
      </div>
    </article>
  );

  if (!slide.href) return body;

  return (
    <a
      href={slide.href}
      className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label={slide.title}
      {...(slide.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {body}
    </a>
  );
}

function SlideBody({ slide, priority }: { slide: EditorialSlide; priority?: boolean }) {
  if (slide.kind === 'html' && slide.html) {
    return <HtmlBannerFrame html={slide.html} title={slide.title} />;
  }
  if (slide.kind === 'hero' || slide.kind === 'image') {
    return <HeroSlide slide={slide} priority={priority} />;
  }
  return null;
}

export default function EditorialBannerCarousel({ slides }: { slides: EditorialSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;
  const multi = total > 1;
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    if (!multi || paused) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [multi, paused, total]);

  if (!slide) return null;

  const go = (next: number) => setIndex(((next % total) + total) % total);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Destaques em banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div key={slide.id} aria-live="polite" aria-atomic="true" className="min-w-0">
        <SlideBody slide={slide} priority={index === 0} />
      </div>

      {multi ? (
        <div className="mt-0 flex flex-wrap items-center justify-between gap-3 border border-t-0 border-white/10 bg-pitch-night px-3 py-2.5 text-white sm:px-5 sm:py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="shrink-0 font-display text-sm tabular-nums tracking-wide text-white/90 sm:text-base">
              {pad(index + 1)} / {pad(total)}
            </span>
            <div className="hidden max-w-[min(100%,14rem)] items-center gap-1 overflow-x-auto sm:flex">
              {slides.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Ir para banner ${i + 1}`}
                  aria-current={i === index ? 'true' : undefined}
                  className={cn(
                    'h-1 shrink-0 transition-all',
                    i === index ? 'w-6 bg-accent' : 'w-3 bg-white/25 hover:bg-white/45'
                  )}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] sm:gap-3 sm:text-xs">
            <button
              type="button"
              aria-label="Banner anterior"
              onClick={() => go(index - 1)}
              className="inline-flex min-h-9 items-center gap-1.5 px-1 text-white/80 transition hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span aria-hidden>←</span>
              Anterior
            </button>
            <span className="text-white/25" aria-hidden>
              |
            </span>
            <button
              type="button"
              aria-label="Próximo banner"
              onClick={() => go(index + 1)}
              className="inline-flex min-h-9 items-center gap-1.5 px-1 text-white/80 transition hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Próximo
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
