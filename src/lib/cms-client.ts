import type {
  Article,
  Category,
  BreakingHeadline,
  AlertItem,
  LiveStory,
} from '@/data/dummy';
import { siteConfig } from '@/lib/site-config';
import {
  HOME_ARTICLE_ENDPOINT,
  articleEndpoints,
  endpointNameForSlug,
  slugForEndpointName,
} from '@/lib/articleEndpoints';
import { BRAZILIAN_STATES, getStateByUf, type BrazilianState } from '@/data/brazilian-states';
import { youtubeEmbedHtml, youtubeId } from '@/lib/youtube';

export type { Article, Category, BreakingHeadline, AlertItem, LiveStory, BrazilianState };

const CMS_BASE = (siteConfig.cms.baseUrl || '').replace(/\/$/, '');
const WEBSITE_KEY = siteConfig.cms.websiteKey;

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreSearch(article: Article, normalizedQuery: string, queryTerms: string[]): number {
  const title = normalizeSearchText(article.title);
  const excerpt = normalizeSearchText(article.excerpt || '');
  const category = normalizeSearchText(article.category || '');
  const author = normalizeSearchText(article.author || '');
  const slug = normalizeSearchText(article.slug || '');
  const content = normalizeSearchText((article.content || '').replace(/<[^>]+>/g, ' '));

  let score = 0;
  if (title === normalizedQuery) score += 150;
  if (title.startsWith(normalizedQuery)) score += 90;
  if (title.includes(normalizedQuery)) score += 70;
  if (category.includes(normalizedQuery)) score += 45;
  if (author.includes(normalizedQuery)) score += 30;
  if (excerpt.includes(normalizedQuery)) score += 25;
  if (slug.includes(normalizedQuery)) score += 20;
  if (content.includes(normalizedQuery)) score += 10;

  for (const term of queryTerms) {
    if (!term) continue;
    if (title.includes(term)) score += 18;
    if (category.includes(term)) score += 12;
    if (author.includes(term)) score += 8;
    if (excerpt.includes(term)) score += 6;
    if (slug.includes(term)) score += 5;
    if (content.includes(term)) score += 2;
  }

  return score;
}

function searchArticles(list: Article[], query: string, limit: number): Article[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];
  const queryTerms = normalizedQuery.split(' ').filter(Boolean);

  return [...list]
    .map((article) => ({ article, score: scoreSearch(article, normalizedQuery, queryTerms) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.article.publishedAt).getTime() - new Date(a.article.publishedAt).getTime();
    })
    .slice(0, limit)
    .map((item) => item.article);
}

function isPublic(doc: Record<string, unknown>): boolean {
  if (String(doc.publishState || '') !== 'published') return false;
  const scheduled = doc.scheduledTime;
  if (scheduled) {
    const t = new Date(String(scheduled)).getTime();
    if (!Number.isNaN(t) && t > Date.now()) return false;
  }
  return true;
}

/** Stable to the minute so Next fetch cache + revalidate actually hit. */
function scheduledBeforeBucket(): string {
  const bucket = new Date();
  bucket.setUTCSeconds(0, 0);
  return bucket.toISOString();
}

function assignmentNames(raw: Record<string, unknown>): string[] {
  const names: string[] = [];
  const assigned = raw.endpointAssignments;
  if (Array.isArray(assigned)) {
    assigned.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const name = String((item as { name?: string }).name || '').trim();
      if (name) names.push(name);
    });
  } else if (assigned && typeof assigned === 'object') {
    const name = String((assigned as { name?: string }).name || '').trim();
    if (name) names.push(name);
  }
  const section = typeof raw.websiteSection === 'string' ? raw.websiteSection.trim() : '';
  if (section) names.push(section);
  return names;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderInlineMarkdown(value: string): string {
  const withLinks = escapeHtml(value).replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g,
    (_match, label: string, href: string) => `<a href="${href}">${label}</a>`
  );

  return withLinks
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])_([^_\n]+?)_(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>')
    .replace(/(^|[\s(])\*([^*\n]+?)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
}

function renderBody(value: string): string {
  const source = value.replace(/\r\n/g, '\n').trim();
  if (!source) return '';
  if (/<\/?(p|div|h[1-6]|ul|ol|li|br|blockquote|figure|section)\b/i.test(source)) return source;

  const html: string[] = [];
  let paragraph: string[] = [];
  let listType: 'ol' | 'ul' | null = null;
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(`<p>${renderInlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listType || listItems.length === 0) {
      listType = null;
      listItems = [];
      return;
    }
    const items = listItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('');
    html.push(`<${listType}>${items}</${listType}>`);
    listType = null;
    listItems = [];
  };

  source.split('\n').forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    const image = line.match(/^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/);
    if (image) {
      flushParagraph();
      flushList();
      const alt = escapeHtml(image[1] || '');
      html.push(`<p><img src="${image[2]}" alt="${alt}" /></p>`);
      return;
    }

    const bareYoutube = line.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?[^\s]+|shorts\/[^\s]+|embed\/[^\s]+)|youtu\.be\/[^\s]+)$/i
    );
    if (bareYoutube) {
      const id = youtubeId(line);
      if (id) {
        flushParagraph();
        flushList();
        html.push(youtubeEmbedHtml(id));
        return;
      }
    }

    const linkedYoutube = line.match(
      /^\[([^\]]*)\]\((https?:\/\/(?:www\.)?(?:youtube\.com\/[^\s)]+|youtu\.be\/[^\s)]+))\)$/i
    );
    if (linkedYoutube) {
      const id = youtubeId(linkedYoutube[2]);
      if (id) {
        flushParagraph();
        flushList();
        html.push(youtubeEmbedHtml(id, linkedYoutube[1] || 'YouTube'));
        return;
      }
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const depth = heading[1].length;
      const tag = depth <= 2 ? 'h2' : depth === 3 ? 'h3' : 'h4';
      const question = heading[2].match(/^(.+\?)\s+(.+)$/);
      if (question) {
        html.push(`<${tag}>${renderInlineMarkdown(question[1])}</${tag}>`);
        paragraph.push(question[2]);
        return;
      }
      html.push(`<${tag}>${renderInlineMarkdown(heading[2])}</${tag}>`);
      return;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      if (listType === 'ul') flushList();
      listType = 'ol';
      listItems.push(ordered[1]);
      return;
    }

    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      if (listType === 'ol') flushList();
      listType = 'ul';
      listItems.push(bullet[1]);
      return;
    }

    if (listType) flushList();
    paragraph.push(line);
  });

  flushParagraph();
  flushList();
  return html.join('\n');
}

function mapCmsArticle(raw: Record<string, unknown>, index = 0): Article {
  const cats = Array.isArray(raw.category)
    ? (raw.category as string[])
    : raw.category
      ? [String(raw.category)]
      : [];
  const assigned = assignmentNames(raw);
  const rawCategory = assigned[0] || cats[0] || 'Notícias';
  const knownSlug = slugForEndpointName(rawCategory);
  const knownEndpoint = knownSlug
    ? articleEndpoints.find((item) => item.slug === knownSlug)
    : undefined;
  const categoryName = knownEndpoint?.name || rawCategory;
  const categorySlug = knownSlug || slugify(categoryName) || 'noticias';
  const authors = Array.isArray(raw.authorNames) ? (raw.authorNames as string[]) : [];
  const images = Array.isArray(raw.imageUrls) ? (raw.imageUrls as string[]) : [];
  const videos = (Array.isArray(raw.videoUrls) ? (raw.videoUrls as unknown[]) : [])
    .map((url) => String(url || '').trim())
    .filter((url) => Boolean(url) && Boolean(youtubeId(url)));
  const videoUrl = videos[0];
  const seo =
    raw.seo && typeof raw.seo === 'object' ? (raw.seo as Record<string, unknown>) : {};
  const published =
    (raw.scheduledTime as string) ||
    (raw.createdAt as string) ||
    new Date().toISOString();
  const keyPoints = Array.isArray(raw.keyPoints)
    ? (raw.keyPoints as unknown[])
        .map((item) => String(item || '').trim())
        .filter(Boolean)
    : undefined;

  return {
    id: String(raw._id || raw.id || raw.slug || index),
    slug: String(raw.slug || ''),
    title: String(raw.title || ''),
    excerpt: String(raw.summary || raw.description || seo.meta_description || ''),
    content: renderBody(String(raw.content || raw.description || '')),
    category: categoryName,
    categorySlug,
    author: authors[0] || 'Redação',
    publishedAt: published,
    imageUrl: images[0],
    isVideo: videos.length > 0,
    videoUrl,
    videoUrls: videos.length > 0 ? videos : undefined,
    readCount: typeof raw.views === 'number' ? raw.views : undefined,
    featured: index === 0,
    keyPoints: keyPoints?.length ? keyPoints : undefined,
  };
}

function sortByDate(items: Article[]): Article[] {
  return [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

type ListPayload = {
  data?: unknown[];
  meta?: { total?: number };
};

async function fetchEndpoint(endpoint: string, limit = 20, page = 1): Promise<Article[] | null> {
  if (!CMS_BASE || !WEBSITE_KEY) return null;
  const params = new URLSearchParams({
    targetWebsite: WEBSITE_KEY,
    endpoint,
    limit: String(limit),
    page: String(page),
    sort: 'scheduledTime',
    order: 'desc',
    scheduledBefore: scheduledBeforeBucket(),
  });

  try {
    const res = await fetch(`${CMS_BASE}/ai-articles?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ListPayload;
    const rows = Array.isArray(json.data) ? json.data : [];
    const records = rows.filter(
      (row): row is Record<string, unknown> => !!row && typeof row === 'object'
    );
    const articles = records
      .filter(isPublic)
      .map((row, i) => mapCmsArticle(row, i))
      .filter((article) => article.slug && article.title);

    if (endpoint === HOME_ARTICLE_ENDPOINT) return articles;

    const total = json.meta?.total;
    if (total === 0) return [];

    const matched = articles.filter((article) => {
      const source = records.find((row) => String(row.slug || '') === article.slug);
      return source ? assignmentNames(source).includes(endpoint) : false;
    });
    if (matched.length > 0) return matched;
    if (typeof total === 'number' && total > 0) return articles;
    return [];
  } catch {
    return null;
  }
}

function listed(items: Article[] | null): Article[] {
  return items ?? [];
}

export async function getArticlesByEndpoint(
  endpoint: string,
  limit = 20,
  page = 1
): Promise<Article[]> {
  return listed(await fetchEndpoint(endpoint, limit, page));
}

export async function getLatestArticles(limit = 10): Promise<Article[]> {
  return sortByDate(listed(await fetchEndpoint(HOME_ARTICLE_ENDPOINT, Math.max(limit, 12)))).slice(
    0,
    limit
  );
}

/** Paginate HomePage for sitemap / RSS (published-only via isPublic). */
export async function getAllPublishedArticles(maxPages = 25, pageSize = 50): Promise<Article[]> {
  const bySlug = new Map<string, Article>();
  for (let page = 1; page <= maxPages; page += 1) {
    const batch = listed(await fetchEndpoint(HOME_ARTICLE_ENDPOINT, pageSize, page));
    if (!batch.length) break;
    for (const article of batch) {
      if (article.slug) bySlug.set(article.slug, article);
    }
    if (batch.length < pageSize) break;
  }
  return sortByDate([...bySlug.values()]);
}

function unwrapArticle(json: unknown): Record<string, unknown> | null {
  if (!json || typeof json !== 'object') return null;
  const obj = json as Record<string, unknown>;
  if (typeof obj.slug === 'string') return obj;
  if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
    const data = obj.data as Record<string, unknown>;
    if (typeof data.slug === 'string') return data;
  }
  return null;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!CMS_BASE || !WEBSITE_KEY) return null;
  try {
    const params = new URLSearchParams({ targetWebsite: WEBSITE_KEY });
    const res = await fetch(
      `${CMS_BASE}/ai-articles/slug/${encodeURIComponent(slug)}?${params.toString()}`,
      { headers: { Accept: 'application/json' }, cache: 'no-store' }
    );
    if (!res.ok) return null;
    const raw = unwrapArticle(await res.json());
    if (!raw || !isPublic(raw) || !raw.slug) return null;
    return mapCmsArticle(raw);
  } catch {
    return null;
  }
}

export async function getByCategory(categorySlug: string, limit = 10): Promise<Article[]> {
  const endpoint = endpointNameForSlug(categorySlug);
  if (endpoint) {
    return sortByDate(listed(await fetchEndpoint(endpoint, Math.max(limit, 20)))).slice(0, limit);
  }
  const home = listed(await fetchEndpoint(HOME_ARTICLE_ENDPOINT, 40));
  return sortByDate(home.filter((article) => article.categorySlug === categorySlug)).slice(
    0,
    limit
  );
}

export async function getMostRead(limit = 5): Promise<Article[]> {
  const all = listed(await fetchEndpoint(HOME_ARTICLE_ENDPOINT, 40));
  return [...all].sort((a, b) => (b.readCount ?? 0) - (a.readCount ?? 0)).slice(0, limit);
}

export async function getFeaturedArticles(limit = 3): Promise<Article[]> {
  const all = listed(await fetchEndpoint(HOME_ARTICLE_ENDPOINT, limit));
  const featured = all.filter((article) => article.featured);
  if (featured.length >= limit) return sortByDate(featured).slice(0, limit);
  return sortByDate(all).slice(0, limit);
}

export async function search(query: string, limit = 20): Promise<Article[]> {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  const live = listed(await fetchEndpoint(HOME_ARTICLE_ENDPOINT, 80));
  return searchArticles(live, normalized, limit);
}

export async function getCategories(): Promise<Category[]> {
  const nav = siteConfig.navCategories;
  if (nav?.length) {
    return nav.map((c) => ({
      id: `nav-${c.slug}`,
      name: c.name,
      slug: c.slug,
      description: `Cobertura de ${c.name} em ${siteConfig.siteName}`,
    }));
  }
  return articleEndpoints.map((item) => ({
    id: `ep-${item.slug}`,
    name: item.name,
    slug: item.slug,
    description: `Cobertura de ${item.name} em ${siteConfig.siteName}`,
  }));
}

export async function getBreakingHeadlines(): Promise<BreakingHeadline[]> {
  const live = listed(await fetchEndpoint(HOME_ARTICLE_ENDPOINT, 8));
  if (!live.length) return [];
  return live.slice(0, 8).map((article, index) => ({
    id: `brk-${article.id}`,
    text: article.title,
    slug: article.slug,
    urgent: index === 0,
  }));
}

export async function getAlerts(_limit = 20): Promise<AlertItem[]> {
  return [];
}

export async function getLiveStories(): Promise<LiveStory[]> {
  return [];
}

export async function getLiveStoryBySlug(_slug: string): Promise<LiveStory | null> {
  return null;
}

export async function getBrazilianStates(): Promise<BrazilianState[]> {
  return BRAZILIAN_STATES;
}

export async function getBrazilianState(uf: string): Promise<BrazilianState | null> {
  return getStateByUf(uf) ?? null;
}
