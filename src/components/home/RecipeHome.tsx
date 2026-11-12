'use client';

import AffiliateSections from '@/components/affiliate/AffiliateSections';
import AffiliateBanner from '@/components/affiliate/AffiliateBanner';
import AffiliateFeed from '@/components/affiliate/AffiliateFeed';
import Link from 'next/link';
import type React from 'react';
import { useEffect, useState } from 'react';
import ArticleCard from '@/components/cards/ArticleCard';
import MotionSection from '@/components/ui/MotionSection';
import type { Article } from '@/lib/cms-client';
import {
  resolveCardVariant,
  resolveFeaturedCardVariant,
} from '@/lib/card-variants';
import { siteConfig, type HomepageRecipe, type RecipeSlot } from '@/lib/site-config';
import ScoreboardStrip from '@/components/football/ScoreboardStrip';
import { getCompetitions, isSportsSite, navHrefForSlug } from '@/lib/competitions';
import FallbackMedia from '@/components/ui/FallbackMedia';

interface RecipeHomeProps {
  articles: Article[];
  mostRead: Article[];
}

function LadderMasthead() {
  return (
    <section className="relative overflow-hidden border border-black/10 bg-pitch-night text-white shadow-elevated">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(240,180,41,0.28),transparent_42%),linear-gradient(120deg,rgba(20,108,67,0.35),transparent_55%)]" />
      <div className="relative grid gap-6 px-4 py-6 md:grid-cols-[1.2fr_0.8fr] md:items-end md:px-6 md:py-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
            Degrau da Bola · Série B
          </p>
          <h1 className="mt-2 max-w-2xl font-display text-4xl uppercase leading-[0.95] tracking-wide md:text-6xl">
            Cada ponto, um degrau pro acesso
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
            Cobertura da corrida pelo acesso: tabela, decisões, rebaixamento e o que move a
            classificação.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Acesso', href: '/categoria/acesso' },
            { label: 'Tabela', href: '/categoria/tabela' },
            { label: 'Ao vivo', href: '/ao-vivo' },
          ].map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden border border-white/10 bg-white/5 p-3 transition hover:border-accent/50 hover:bg-white/10"
              style={{ marginTop: `${(2 - index) * 10}px` }}
            >
              <span className="block h-1 w-full bg-gradient-to-r from-primary via-success to-accent" />
              <span className="mt-3 block font-display text-xl uppercase tracking-wide">{item.label}</span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-white/55">
                Degrau {index + 1}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroCarousel({ articles }: { articles: Article[] }) {
  const slides = articles.slice(0, 5);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <div className="flex min-h-[280px] items-center justify-center bg-pitch-night/5 px-4 py-10 text-center">
        <p className="text-sm text-muted">Nenhum destaque disponível no momento.</p>
      </div>
    );
  }

  const active = slides[index] || slides[0];

  return (
    <section className="relative overflow-hidden bg-pitch-night text-white">
      <div className="relative min-h-[320px] md:min-h-[440px]">
        <FallbackMedia
          key={active.id}
          src={active.imageUrl}
          alt=""
          fill
          priority
          objectFit="contain"
          className="absolute inset-0 h-full w-full opacity-90"
          fallbackClassName="absolute inset-0"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pitch-night via-pitch-night/80 to-pitch-night/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(240,180,41,0.22),transparent_40%)]" />

        <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-end gap-5 p-5 md:min-h-[440px] md:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
              <span className="h-2 w-2 animate-pulse rounded-full bg-live" />
              Holofote · {active.category || 'Destaque'}
            </p>
            <Link
              href={`/artigo/${active.slug}`}
              className="mt-3 block font-display text-3xl uppercase leading-[0.95] tracking-wide hover:text-accent md:text-5xl lg:text-6xl"
            >
              {active.title}
            </Link>
            {active.excerpt ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
                {active.excerpt}
              </p>
            ) : null}
            <Link
              href={`/artigo/${active.slug}`}
              className="mt-5 inline-flex min-h-11 items-center bg-accent px-5 text-xs font-bold uppercase tracking-[0.18em] text-pitch-night hover:bg-white"
            >
              Ler agora
            </Link>
          </div>

          <div className="flex w-full max-w-md flex-col gap-2 lg:w-72">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(slideIndex)}
                className={`flex items-start gap-3 border px-3 py-2 text-left transition ${
                  slideIndex === index
                    ? 'border-accent bg-accent/15'
                    : 'border-white/10 bg-black/25 hover:border-white/30'
                }`}
              >
                <span className="font-display text-lg text-accent">{String(slideIndex + 1).padStart(2, '0')}</span>
                <span className="line-clamp-2 text-xs font-semibold leading-snug text-white/90">
                  {slide.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function take(
  articles: Article[],
  slot: RecipeSlot,
  offset: { n: number }
): Article[] {
  const limit = slot.limit ?? 4;
  let pool = articles;
  if (slot.categorySlug) {
    const filtered = articles.filter((a) => a.categorySlug === slot.categorySlug);
    if (filtered.length) pool = filtered;
  }
  const slice = pool.slice(offset.n, offset.n + limit);
  offset.n += slice.length;
  // wrap if exhausted
  if (slice.length < limit) {
    return [...slice, ...pool.slice(0, limit - slice.length)];
  }
  return slice;
}

function HeroLead({ articles }: { articles: Article[] }) {
  const [a, b, c] = articles;
  if (!a) return null;
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
      <ArticleCard
        article={a}
        variant={resolveFeaturedCardVariant(siteConfig.components.featuredCard.variant)}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {b ? <ArticleCard article={b} variant="horizontal" className="h-full" /> : null}
        {c ? <ArticleCard article={c} variant="horizontal" className="h-full" /> : null}
      </div>
    </section>
  );
}

function HeroSplit({ articles }: { articles: Article[] }) {
  const a = articles[0];
  if (!a) return null;
  return (
    <section className="grid gap-4 overflow-hidden rounded-lg border border-black/10 bg-white md:grid-cols-2">
      <div className="flex flex-col justify-center p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          {a.category || 'Destaque'}
        </p>
        <Link href={`/artigo/${a.slug}`} className="mt-2 font-display text-3xl leading-tight text-secondary hover:underline md:text-4xl">
          {a.title}
        </Link>
        {a.excerpt && (
          <p className="mt-3 text-sm leading-relaxed text-muted-text line-clamp-3">{a.excerpt}</p>
        )}
      </div>
      <div className="relative min-h-[220px] bg-black/5">
        <FallbackMedia
          src={a.imageUrl}
          alt=""
          fill
          className="absolute inset-0 h-full w-full object-cover"
          fallbackClassName="absolute inset-0"
        />
      </div>
    </section>
  );
}

function HeroOverlay({ articles }: { articles: Article[] }) {
  const a = articles[0];
  if (!a) return null;
  return (
    <Link
      href={`/artigo/${a.slug}`}
      className="relative block min-h-[320px] overflow-hidden rounded-lg bg-secondary md:min-h-[420px]"
    >
      <FallbackMedia
        src={a.imageUrl}
        alt=""
        fill
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        fallbackClassName="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 p-6 text-white md:p-10">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">{a.category || 'Capa'}</p>
        <h2 className="mt-2 max-w-3xl font-display text-3xl leading-tight md:text-5xl">{a.title}</h2>
      </div>
    </Link>
  );
}

function HeroEditorial({ articles }: { articles: Article[] }) {
  const a = articles[0];
  if (!a) return null;
  return (
    <section className="mx-auto max-w-3xl border-b border-black/10 pb-8 pt-4 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
        {a.category || 'Editorial'}
      </p>
      <Link href={`/artigo/${a.slug}`} className="mt-3 block font-display text-4xl leading-tight text-secondary hover:underline md:text-5xl">
        {a.title}
      </Link>
      {a.excerpt && (
        <p className="mx-auto mt-4 max-w-2xl font-body text-base leading-relaxed text-muted-text md:text-lg">
          {a.excerpt}
        </p>
      )}
    </section>
  );
}

function HeroCompact({ articles }: { articles: Article[] }) {
  const a = articles[0];
  if (!a) return null;
  return (
    <Link
      href={`/artigo/${a.slug}`}
      className="flex items-center gap-4 rounded border border-black/10 bg-surface px-4 py-3 hover:border-primary/40"
    >
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-black/5">
        <FallbackMedia
          src={a.imageUrl}
          alt=""
          fill
          className="h-full w-full object-cover"
          fallbackClassName="absolute inset-0"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{a.category}</p>
        <h2 className="truncate font-heading text-lg text-secondary">{a.title}</h2>
      </div>
    </Link>
  );
}

function HeroAsymmetric({ articles }: { articles: Article[] }) {
  const [a, b] = articles;
  if (!a) return null;
  return (
    <div className="grid gap-3 md:grid-cols-12">
      <div className="md:col-span-8">
        <ArticleCard article={a} variant={resolveFeaturedCardVariant('image-first-large')} />
      </div>
      {b && (
        <div className="md:col-span-4">
          <ArticleCard article={b} variant="compact" />
        </div>
      )}
    </div>
  );
}

function HeroStack({ articles }: { articles: Article[] }) {
  const [a, b] = articles;
  if (!a) return null;
  return (
    <div className="space-y-3">
      <ArticleCard article={a} variant={resolveFeaturedCardVariant(siteConfig.components.featuredCard.variant)} />
      {b && <ArticleCard article={b} variant="horizontal" />}
    </div>
  );
}

function HeroMinimal({ articles }: { articles: Article[] }) {
  const a = articles[0];
  if (!a) return null;
  return (
    <section className="py-10">
      <Link href={`/artigo/${a.slug}`} className="font-display text-4xl leading-none tracking-tight text-secondary hover:text-primary md:text-6xl">
        {a.title}
      </Link>
    </section>
  );
}

function HeroBroadcast({ articles }: { articles: Article[] }) {
  const a = articles[0];
  if (!a) return null;
  return (
    <section className="overflow-hidden rounded border-2 border-primary bg-white">
      <div className="flex items-center gap-2 bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
        Ao vivo
      </div>
      <div className="p-1">
        <ArticleCard
          article={a}
          variant={resolveFeaturedCardVariant(siteConfig.components.featuredCard.variant)}
        />
      </div>
    </section>
  );
}

function HeroMagazine({ articles }: { articles: Article[] }) {
  const a = articles[0];
  if (!a) return null;
  return (
    <Link href={`/artigo/${a.slug}`} className="group relative block aspect-[16/10] overflow-hidden rounded-xl bg-secondary">
      <FallbackMedia
        src={a.imageUrl}
        alt=""
        fill
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        fallbackClassName="absolute inset-0"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Capa</p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl text-white md:text-5xl">{a.title}</h2>
      </div>
    </Link>
  );
}

function HeroTimeline({ articles }: { articles: Article[] }) {
  const items = articles.slice(0, 3);
  if (!items.length) return null;
  return (
    <section className="rounded-lg border border-black/10 bg-white p-4 md:p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Linha do tempo</p>
      <ol className="mt-4 space-y-4 border-l-2 border-primary/30 pl-4">
        {items.map((a, i) => (
          <li key={a.id} className="relative">
            <span className="absolute -left-[1.4rem] top-1 h-3 w-3 rounded-full bg-primary" />
            <p className="text-[10px] font-semibold uppercase text-muted-text">
              {i === 0 ? 'Agora' : `+${i}h`}
            </p>
            <Link href={`/artigo/${a.slug}`} className="mt-1 block font-heading text-lg text-secondary hover:underline">
              {a.title}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

function HeroCoverDuo({ articles }: { articles: Article[] }) {
  const [a, b] = articles;
  if (!a) return null;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Link href={`/artigo/${a.slug}`} className="group relative min-h-[280px] overflow-hidden rounded-xl bg-secondary">
        <FallbackMedia
          src={a.imageUrl}
          alt=""
          fill
          className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
          fallbackClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="absolute bottom-0 p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">{a.category}</p>
          <h2 className="mt-1 font-display text-2xl leading-tight">{a.title}</h2>
        </div>
      </Link>
      {b ? (
        <Link href={`/artigo/${b.slug}`} className="group relative min-h-[280px] overflow-hidden rounded-xl bg-secondary">
          <FallbackMedia
            src={b.imageUrl}
            alt=""
            fill
            className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
            fallbackClassName="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
          <div className="absolute bottom-0 p-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent">{b.category}</p>
            <h2 className="mt-1 font-display text-2xl leading-tight">{b.title}</h2>
          </div>
        </Link>
      ) : (
        <div className="min-h-[280px] rounded-xl border border-dashed border-black/20 bg-surface" />
      )}
    </div>
  );
}

function RankedRail({ articles }: { articles: Article[] }) {
  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-3 border-b border-black/10 pb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">Escada do dia</p>
          <h2 className="mt-1 font-display text-2xl uppercase tracking-wide text-secondary">
            Degraus quentes
          </h2>
        </div>
        <Link href="/ultimas" className="text-xs font-bold uppercase tracking-[0.16em] text-primary hover:underline">
          Ver fila
        </Link>
      </div>
      <ol className="space-y-0 border-l-4 border-accent/80 pl-0">
        {articles.map((article, i) => (
          <li key={article.id} className="relative border-b border-black/5 last:border-b-0">
            <div
              className="absolute -left-[4px] top-0 h-full w-1 bg-primary"
              style={{ opacity: 1 - i * 0.12 }}
              aria-hidden
            />
            <ArticleCard article={article} variant="rail" rank={i + 1} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function CategoryRail({ articles }: { articles: Article[] }) {
  const primary = siteConfig.navCategories[0];
  return (
    <section>
      <div className="mb-3 flex items-center justify-between border-b-2 border-primary pb-1">
        <h2 className="font-display text-xl uppercase tracking-wide text-secondary">
          {primary?.name || 'Destaques'}
        </h2>
        {primary && (
          <Link
            href={`/categoria/${primary.slug}`}
            className="text-xs font-semibold uppercase text-primary hover:underline"
          >
            Ver mais
          </Link>
        )}
      </div>
      <AffiliateFeed className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" mode="grid">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant={resolveCardVariant(siteConfig.components.standardCard.variant)}
          />
        ))}
      </AffiliateFeed>
    </section>
  );
}

function HorizontalStream({ articles }: { articles: Article[] }) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3 border-b-2 border-secondary pb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">Linha de passe</p>
          <h2 className="mt-1 font-display text-2xl uppercase tracking-wide text-secondary">Últimas jogadas</h2>
        </div>
        <Link href="/news" className="text-xs font-bold uppercase tracking-[0.18em] text-primary hover:underline">
          Arquivo
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} article={article} variant="horizontal" />
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
          {articles.slice(3, 6).map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}

function CompactGrid({ articles }: { articles: Article[] }) {
  return (
    <AffiliateFeed className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" mode="grid">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} variant="compact" />
      ))}
    </AffiliateFeed>
  );
}

function VisualMosaicGrid({ articles }: { articles: Article[] }) {
  const [a, b, c, ...rest] = articles;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-12 md:grid-rows-2">
        {a && (
          <div className="md:col-span-7 md:row-span-2">
            <ArticleCard article={a} variant="lead" className="h-full" />
          </div>
        )}
        {b && (
          <div className="md:col-span-5">
            <ArticleCard article={b} variant="compact" />
          </div>
        )}
        {c && (
          <div className="md:col-span-5">
            <ArticleCard article={c} variant="compact" />
          </div>
        )}
      </div>
      {rest.length > 0 && (
        <AffiliateFeed className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" mode="grid">
          {rest.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </AffiliateFeed>
      )}
    </div>
  );
}

function DiscoveryChips() {
  const chips = isSportsSite()
    ? [
        { name: 'Partidas', href: '/futebol' },
        ...getCompetitions().map((c) => ({
          name: c.name,
          href: `/liga/${c.slug}`,
        })),
      ]
    : siteConfig.navCategories.map((cat) => ({
        name: cat.name,
        href: navHrefForSlug(cat.slug),
      }));
  return (
    <div>
      <div className="mb-4 border-b border-black/10 pb-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">Portões do estádio</p>
        <h2 className="mt-1 font-display text-2xl uppercase tracking-wide text-secondary">
          Entre pela seção
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {chips.map((chip, index) => (
          <Link
            key={chip.href}
            href={chip.href}
            className="group border border-black/10 bg-surface px-3 py-4 transition hover:border-primary hover:bg-primary hover:text-white"
          >
            <span className="block font-display text-xs uppercase tracking-[0.2em] text-accent group-hover:text-white/80">
              Gate {String(index + 1).padStart(2, '0')}
            </span>
            <span className="mt-2 block font-heading text-lg uppercase leading-none">{chip.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MostReadPanel({ articles }: { articles: Article[] }) {
  return (
    <div className="border border-black/10 bg-[linear-gradient(180deg,#fbfcfa_0%,#eef5f0_100%)] p-4 md:p-5">
      <div className="mb-4 border-b border-black/10 pb-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">Torcida</p>
        <h2 className="mt-1 font-display text-xl uppercase tracking-wide text-secondary">
          Degraus mais lidos
        </h2>
      </div>
      <div className="space-y-2">
        {articles.map((article, i) => (
          <ArticleCard key={article.id} article={article} variant="rail" rank={i + 1} />
        ))}
      </div>
    </div>
  );
}

function NewsletterCard() {
  return (
    <div className="relative overflow-hidden border border-accent/30 bg-pitch-night p-5 text-white">
      <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full border-4 border-accent/40" />
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Boletim do acesso</p>
      <p className="mt-2 font-display text-2xl uppercase leading-none">
        Receba a classificação no e-mail
      </p>
      <p className="mt-3 text-sm text-white/70">
        Alertas da Série B, decisões e a corrida pelo acesso — direto da redação {siteConfig.siteName}.
      </p>
      <Link
        href="/contact"
        className="mt-4 inline-flex min-h-11 items-center bg-accent px-4 text-xs font-bold uppercase tracking-[0.16em] text-pitch-night hover:bg-white"
      >
        Inscrever-se
      </Link>
    </div>
  );
}

function DualSection({ articles }: { articles: Article[] }) {
  const mid = Math.ceil(articles.length / 2);
  const left = articles.slice(0, mid);
  const right = articles.slice(mid);
  const primary = siteConfig.navCategories[0];
  const secondary = siteConfig.navCategories[1];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <section className="border border-black/10 bg-surface">
        <div className="flex items-center justify-between border-b-4 border-primary bg-secondary px-4 py-3 text-white">
          <h2 className="font-display text-xl uppercase tracking-wide">
            {primary?.name || 'Destaques'}
          </h2>
          {primary ? (
            <Link href={`/categoria/${primary.slug}`} className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
              Abrir
            </Link>
          ) : null}
        </div>
        <div className="space-y-2 p-3">
          {left.map((a) => (
            <ArticleCard key={a.id} article={a} variant="horizontal" />
          ))}
        </div>
      </section>
      <section className="border border-black/10 bg-surface">
        <div className="flex items-center justify-between border-b-4 border-accent bg-pitch-night px-4 py-3 text-white">
          <h2 className="font-display text-xl uppercase tracking-wide">
            {secondary?.name || 'Mais'}
          </h2>
          {secondary ? (
            <Link href={`/categoria/${secondary.slug}`} className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
              Abrir
            </Link>
          ) : null}
        </div>
        <div className="space-y-2 p-3">
          {right.map((a) => (
            <ArticleCard key={a.id} article={a} variant="horizontal" />
          ))}
        </div>
      </section>
    </div>
  );
}

function resolveBlockId(block: string): {
  block: string;
  wrapperClass?: string;
  options?: Record<string, unknown>;
} {
  const promo = siteConfig.componentRegistry?.blocks?.find((b) => b.blockId === block);
  if (promo) {
    return {
      block: promo.baseBlock,
      wrapperClass: promo.wrapperClass,
      options: promo.options,
    };
  }
  return { block };
}

function renderBlock(
  slot: RecipeSlot,
  articles: Article[],
  mostRead: Article[],
  cursor: { n: number }
) {
  const resolved = resolveBlockId(slot.block);
  const effectiveSlot = { ...slot, block: resolved.block };
  const items =
    effectiveSlot.kind === 'most-read'
      ? mostRead.slice(0, effectiveSlot.limit ?? 5)
      : effectiveSlot.kind === 'scoreboard' ||
          effectiveSlot.kind === 'discovery-chips' ||
          effectiveSlot.kind === 'newsletter'
        ? []
        : take(articles, effectiveSlot, cursor);

  let node: React.ReactNode = null;
  switch (resolved.block) {
    case 'HeroCarousel':
      node = <HeroCarousel articles={items} />;
      break;
    case 'HeroLead':
      node = <HeroLead articles={items} />;
      break;
    case 'HeroSplit':
      node = <HeroSplit articles={items} />;
      break;
    case 'HeroOverlay':
      node = <HeroOverlay articles={items} />;
      break;
    case 'HeroEditorial':
      node = <HeroEditorial articles={items} />;
      break;
    case 'HeroCompact':
      node = <HeroCompact articles={items} />;
      break;
    case 'HeroAsymmetric':
      node = <HeroAsymmetric articles={items} />;
      break;
    case 'HeroStack':
      node = <HeroStack articles={items} />;
      break;
    case 'HeroMinimal':
      node = <HeroMinimal articles={items} />;
      break;
    case 'HeroBroadcast':
      node = <HeroBroadcast articles={items} />;
      break;
    case 'HeroMagazine':
      node = <HeroMagazine articles={items} />;
      break;
    case 'HeroTimeline':
      node = <HeroTimeline articles={items} />;
      break;
    case 'HeroCoverDuo':
      node = <HeroCoverDuo articles={items} />;
      break;
    case 'RankedRail':
      node = <RankedRail articles={items} />;
      break;
    case 'CategoryRail':
      node = <CategoryRail articles={items} />;
      break;
    case 'HorizontalStream':
      node = <HorizontalStream articles={items} />;
      break;
    case 'CompactGrid':
      node = <CompactGrid articles={items} />;
      break;
    case 'VisualMosaicGrid':
      node = <VisualMosaicGrid articles={items} />;
      break;
    case 'ScoreboardStrip':
      node = <ScoreboardStrip />;
      break;
    case 'DiscoveryChips':
      node = <DiscoveryChips />;
      break;
    case 'MostReadPanel':
      node = <MostReadPanel articles={items.length ? items : mostRead} />;
      break;
    case 'NewsletterCard':
      node = <NewsletterCard />;
      break;
    case 'DualSection':
      node = <DualSection articles={items} />;
      break;
    default:
      node = null;
  }

  if (!node) return null;
  if (resolved.wrapperClass) {
    return <div className={resolved.wrapperClass}>{node}</div>;
  }
  return node;
}

function shellClass(recipe: HomepageRecipe): string {
  switch (recipe.grid) {
    case 'mosaic-12':
      return 'mx-auto max-w-7xl space-y-6 px-3 py-5 md:px-4 md:py-8';
    case 'scoreboard-split':
      return 'mx-auto max-w-7xl space-y-5 px-3 py-5 md:px-4 md:py-7';
    case 'main-sidebar':
      return 'mx-auto max-w-7xl space-y-5 px-3 py-5 md:px-4 md:py-7';
    default:
      return 'mx-auto max-w-6xl space-y-6 px-3 py-7 md:px-4';
  }
}

function sectionChromeClass(slot: RecipeSlot, featured = false): string {
  const isUtility = slot.kind === 'scoreboard' || slot.kind === 'discovery-chips';
  const isHero = slot.kind === 'hero';

  if (isHero) {
    return [
      'overflow-hidden border border-black/15 bg-pitch-night shadow-elevated',
      featured ? 'ring-1 ring-accent/25' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  if (isUtility) {
    return 'overflow-hidden border border-black/10 bg-surface/95 shadow-card';
  }

  return [
    'overflow-hidden border border-black/10 bg-surface shadow-card',
    featured ? 'ring-1 ring-primary/15' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function sectionInnerClass(slot: RecipeSlot): string {
  if (slot.kind === 'hero') return 'p-0';
  if (slot.kind === 'scoreboard') return 'p-3 md:p-4';
  if (slot.kind === 'newsletter' || slot.kind === 'most-read') return 'p-0';
  return 'p-4 md:p-5';
}

function renderSlotCard(
  slot: RecipeSlot,
  articles: Article[],
  mostRead: Article[],
  cursor: { n: number },
  featured = false
) {
  return (
    <MotionSection key={slot.id} className={sectionChromeClass(slot, featured)}>
      <div className={sectionInnerClass(slot)}>{renderBlock(slot, articles, mostRead, cursor)}</div>
    </MotionSection>
  );
}

/**
 * Homepage from bounded layout recipe (registered blocks only).
 * Sole homepage renderer — DNA layout components removed.
 */
export default function RecipeHome({ articles, mostRead }: RecipeHomeProps) {
  const recipe = siteConfig.homepageRecipe;
  if (!recipe?.slots?.length) {
    return null;
  }

  const layout = recipe.homepageLayout || siteConfig.layouts.homepage;
  const cursor = { n: 0 };
  const sidebarKinds = new Set(['most-read', 'newsletter']);
  // Magazine = single column essay shell (never main-sidebar card grid)
  const useMagazineShell = layout === 'premium-magazine' || recipe.grid === 'single';
  const useModularShell = layout === 'modular-news-portal';
  const useSidebar =
    !useMagazineShell &&
    (recipe.grid === 'main-sidebar' || recipe.grid === 'scoreboard-split');

  if (useMagazineShell) {
    return (
      <div className="mx-auto max-w-3xl space-y-8 px-3 py-10 md:px-4 md:py-14">
        <LadderMasthead />
        {recipe.slots.map((slot, index) =>
          renderSlotCard(slot, articles, mostRead, cursor, index === 0)
        )}
      </div>
    );
  }

  if (useModularShell) {
    const main = recipe.slots.filter((s) => !sidebarKinds.has(s.kind));
    const side = recipe.slots.filter((s) => sidebarKinds.has(s.kind));
    return (
      <div>
        <div className="mx-auto max-w-7xl space-y-4 px-3 py-5 md:px-4 md:py-6">
          <LadderMasthead />
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <AffiliateSections enabled={articles.length >= 6}>
                {main.map((slot, index) =>
                  renderSlotCard(slot, articles, mostRead, cursor, index === 0)
                )}
              </AffiliateSections>
            </div>
            <aside className="space-y-4 lg:col-span-4">
              {articles.length >= 6 && <AffiliateBanner preset="card" />}
              {side.map((slot) => renderSlotCard(slot, articles, mostRead, cursor))}
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (useSidebar) {
    const heroSlots = recipe.slots.filter((s) => s.kind === 'hero' || s.kind === 'scoreboard');
    const main = recipe.slots.filter(
      (s) => !sidebarKinds.has(s.kind) && s.kind !== 'hero' && s.kind !== 'scoreboard'
    );
    const side = recipe.slots.filter((s) => sidebarKinds.has(s.kind));
    return (
      <div className={shellClass(recipe)}>
        <LadderMasthead />
        <div className="space-y-4">
          {heroSlots.map((slot, index) =>
            renderSlotCard(slot, articles, mostRead, cursor, index === 0)
          )}
        </div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="space-y-4">
            <AffiliateSections enabled={articles.length >= 6}>
              {main.map((slot) => renderSlotCard(slot, articles, mostRead, cursor))}
            </AffiliateSections>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-20">
            {articles.length >= 6 && <AffiliateBanner preset="card" />}
            {side.map((slot) => renderSlotCard(slot, articles, mostRead, cursor))}
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className={shellClass(recipe)}>
      <LadderMasthead />
      <AffiliateSections enabled={articles.length >= 6}>
        {recipe.slots.map((slot, index) =>
          renderSlotCard(slot, articles, mostRead, cursor, index === 0)
        )}
      </AffiliateSections>
    </div>
  );
}
