'use client';

import AffiliateSections from '@/components/affiliate/AffiliateSections';


import AffiliateBanner from '@/components/affiliate/AffiliateBanner';
import AffiliateFeed from '@/components/affiliate/AffiliateFeed';


import Link from 'next/link';
import type React from 'react';
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

function TopBriefBar({ articles }: { articles: Article[] }) {
  const items = articles.slice(0, 4);
  const quickSearches = ['Série B', 'Tabela', 'Partidas', 'Transferências', 'Clubes'];
  if (!items.length) return null;

  return (
    <section className="overflow-hidden rounded-[22px] border border-black/10 bg-[linear-gradient(135deg,rgba(11,61,46,0.98)_0%,rgba(22,101,52,0.96)_100%)] text-white shadow-[0_18px_45px_rgba(11,61,46,0.22)]">
      <div className="flex flex-col gap-4 p-4 md:p-5">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-200">Panorama do dia</p>
            <h2 className="mt-1 font-display text-xl uppercase tracking-wide">Destaques do acesso</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/busca"
              className="inline-flex min-h-10 items-center rounded-full border border-white/15 bg-white/10 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white hover:text-[#0B3D2E]"
            >
              Buscar notícias
            </Link>
            <Link
              href="/news"
              className="inline-flex min-h-10 items-center rounded-full bg-white px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#0B3D2E] hover:bg-emerald-50"
            >
              Ver cobertura
            </Link>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {items.map((article, index) => (
            <Link
              key={article.id}
              href={`/artigo/${article.slug}`}
              className="rounded-[18px] border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200">
                0{index + 1} · {article.category}
              </p>
              <h3 className="mt-2 line-clamp-3 font-heading text-sm font-semibold leading-snug text-white md:text-base">
                {article.title}
              </h3>
              <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-white/70">
                {article.author}
              </p>
            </Link>
          ))}
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
    <div className="rounded border border-black/10 bg-surface p-3">
      <h2 className="mb-2 border-b-2 border-primary pb-1 font-display text-lg uppercase tracking-wide text-secondary">
        Ao vivo
      </h2>
      {articles.map((article, i) => (
        <ArticleCard key={article.id} article={article} variant="rail" rank={i + 1} />
      ))}
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
<<<<<<< HEAD
      <h2 className="mb-3 border-b-2 border-primary pb-1 font-display text-xl uppercase tracking-wide text-secondary">
        Últimas
      </h2>
      <AffiliateFeed className="divide-y divide-black/10 rounded border border-black/10 bg-white" mode="list">
=======
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-black/5 pb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">Cobertura</p>
          <h2 className="mt-1 font-display text-xl uppercase tracking-wide text-secondary">Últimas</h2>
        </div>
        <Link href="/news" className="text-xs font-semibold uppercase tracking-[0.18em] text-primary hover:underline">
          Ver tudo
        </Link>
      </div>
      <div className="space-y-3">
>>>>>>> 00ade39 (Improve loading states and shared UI components)
        {articles.map((article) => (
          <div key={article.id}>
            <ArticleCard article={article} variant="horizontal" />
          </div>
        ))}
      </AffiliateFeed>
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
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-black/5 pb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">Navegação</p>
          <h2 className="mt-1 font-heading text-lg text-secondary">Explore rapidamente</h2>
        </div>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {chips.map((chip) => (
          <Link
            key={chip.href}
            href={chip.href}
            className="rounded-full border border-black/10 bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wide text-secondary shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
          >
            {chip.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MostReadPanel({ articles }: { articles: Article[] }) {
  return (
    <div className="rounded-[20px] bg-gradient-to-br from-white via-white to-slate-50 p-4 md:p-5">
      <div className="mb-4 border-b border-black/5 pb-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">Audiência</p>
        <h2 className="mt-1 font-display text-lg uppercase tracking-wide text-primary">Mais lidas</h2>
      </div>
      {articles.map((article, i) => (
        <ArticleCard key={article.id} article={article} variant="rail" rank={i + 1} />
      ))}
    </div>
  );
}

function NewsletterCard() {
  return (
    <div className="rounded bg-secondary p-4 text-white">
      <p className="text-xs font-bold uppercase tracking-widest text-accent">Newsletter</p>
      <p className="mt-2 text-sm text-white/80">
        Receba as principais notícias de {siteConfig.siteName} no seu e-mail.
      </p>
      <Link
        href="/contact"
        className="mt-3 inline-block rounded bg-primary px-4 py-2 text-xs font-bold uppercase"
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
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-lg border border-black/10 bg-white p-4">
        <h2 className="mb-3 font-heading text-sm font-bold uppercase">
          {primary?.name || 'Destaques'}
        </h2>
        {left.map((a) => (
          <ArticleCard key={a.id} article={a} variant="horizontal" />
        ))}
      </section>
      <section className="rounded-lg border border-black/10 bg-white p-4">
        <h2 className="mb-3 font-heading text-sm font-bold uppercase">
          {secondary?.name || 'Mais'}
        </h2>
        {right.map((a) => (
          <ArticleCard key={a.id} article={a} variant="horizontal" />
        ))}
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
      return 'mx-auto max-w-7xl space-y-6 px-4 py-6 md:py-8';
    case 'scoreboard-split':
      return 'mx-auto max-w-7xl space-y-5 px-4 py-5 md:py-8';
    case 'main-sidebar':
      return 'mx-auto max-w-7xl space-y-5 px-4 py-5 md:py-8';
    default:
      return 'mx-auto max-w-6xl space-y-6 px-4 py-8';
  }
}

function sectionChromeClass(slot: RecipeSlot, featured = false): string {
  const isUtility = slot.kind === 'scoreboard' || slot.kind === 'discovery-chips';
  const isHero = slot.kind === 'hero';

  if (isHero) {
    return [
      'overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]',
      featured ? 'ring-1 ring-primary/15' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  if (isUtility) {
    return 'overflow-hidden rounded-[20px] border border-black/10 bg-white/95 shadow-card';
  }

  return [
    'overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-card transition-shadow duration-200',
    'hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]',
    featured ? 'ring-1 ring-primary/10' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function sectionInnerClass(slot: RecipeSlot): string {
  if (slot.kind === 'hero') return 'p-0';
  if (slot.kind === 'scoreboard') return 'p-3 md:p-4';
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
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-12 md:py-16">
<<<<<<< HEAD
        <AffiliateSections enabled={articles.length >= 6}>{recipe.slots.map((slot) => (
          <MotionSection key={slot.id}>
            {renderBlock(slot, articles, mostRead, cursor)}
          </MotionSection>
        ))}</AffiliateSections>
=======
        <TopBriefBar articles={articles} />
        {recipe.slots.map((slot, index) => renderSlotCard(slot, articles, mostRead, cursor, index === 0))}
>>>>>>> 00ade39 (Improve loading states and shared UI components)
      </div>
    );
  }

  if (useModularShell) {
    const main = recipe.slots.filter((s) => !sidebarKinds.has(s.kind));
    const side = recipe.slots.filter((s) => sidebarKinds.has(s.kind));
    return (
      <div className="bg-surface/80">
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-6">
          <TopBriefBar articles={articles} />
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <AffiliateSections enabled={articles.length >= 6}>
                {main.map((slot, index) => renderSlotCard(slot, articles, mostRead, cursor, index === 0))}
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
    const main = recipe.slots.filter((s) => !sidebarKinds.has(s.kind));
    const side = recipe.slots.filter((s) => sidebarKinds.has(s.kind));
    return (
      <div className={shellClass(recipe)}>
        <TopBriefBar articles={articles} />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="space-y-4">
            <AffiliateSections enabled={articles.length >= 6}>
              {main.map((slot, index) => renderSlotCard(slot, articles, mostRead, cursor, index === 0))}
            </AffiliateSections>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-4">
            {articles.length >= 6 && <AffiliateBanner preset="card" />}
            {side.map((slot) => renderSlotCard(slot, articles, mostRead, cursor))}
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className={shellClass(recipe)}>
      <TopBriefBar articles={articles} />
      <AffiliateSections enabled={articles.length >= 6}>
        {recipe.slots.map((slot, index) => renderSlotCard(slot, articles, mostRead, cursor, index === 0))}
      </AffiliateSections>
    </div>
  );
}
