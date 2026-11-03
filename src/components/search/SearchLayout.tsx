import Link from 'next/link';
import type { Article } from '@/lib/cms-client';
import FallbackMedia from '@/components/ui/FallbackMedia';

interface SearchLayoutProps {
  query: string;
  results: Article[];
}

function SearchForm({ query }: { query: string }) {
  return (
    <form action="/busca" method="get" className="mb-6 flex flex-col gap-3 sm:flex-row">
      <input
        type="search"
        name="q"
        defaultValue={query}
        placeholder="Digite palavras-chave..."
        className="min-h-12 flex-1 rounded-full border border-black/15 bg-white px-5 text-sm focus:border-primary focus:outline-none"
      />
      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold uppercase text-white hover:bg-primary/90"
      >
        Buscar
      </button>
    </form>
  );
}

function SearchResultRow({ article }: { article: Article }) {
  return (
    <Link
      href={`/artigo/${article.slug}`}
      className="flex items-start gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:border-primary/25 hover:bg-primary/5"
    >
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        <FallbackMedia
          src={article.imageUrl}
          alt=""
          fill
          sizes="112px"
          className="object-cover"
          fallbackClassName="absolute inset-0"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            {article.category}
          </span>
          {article.isVideo ? (
            <span className="inline-flex items-center rounded-full bg-accent/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">
              Vídeo
            </span>
          ) : null}
        </div>

        <h2 className="mt-2 line-clamp-2 font-heading text-base font-semibold leading-snug text-foreground md:text-lg">
          {article.title}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}

export default function SearchLayout({ query, results }: SearchLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-10">
      <header className="mb-6 rounded-[22px] border border-black/10 bg-white p-5 shadow-card">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Busca</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-wide text-secondary">Encontre notícias</h1>
        <p className="mt-2 text-sm text-muted">Pesquise e veja resultados com imagem, título e resumo.</p>
      </header>

      <SearchForm query={query} />

      {query ? (
        <p className="mb-4 text-sm text-muted">
          {results.length} resultado{results.length !== 1 ? 's' : ''} para &ldquo;{query}&rdquo;
        </p>
      ) : null}

      {query && results.length === 0 ? (
        <div className="rounded-[22px] border border-black/10 bg-white p-6 text-center shadow-card">
          <p className="text-base font-medium text-secondary">Nenhuma notícia encontrada.</p>
          <p className="mt-2 text-sm text-muted">Tente outros termos ou veja as últimas notícias.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              href="/news"
              className="inline-flex min-h-10 items-center rounded-full border border-black/10 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-secondary hover:border-primary hover:text-primary"
            >
              Ver últimas
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-10 items-center rounded-full bg-primary px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-primary/90"
            >
              Voltar à home
            </Link>
          </div>
        </div>
      ) : null}

      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((article) => (
            <SearchResultRow key={article.id} article={article} />
          ))}
        </div>
      ) : null}
    </div>
  );
}