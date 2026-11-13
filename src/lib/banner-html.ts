import { siteConfig } from '@/lib/site-config';

function canonicalHostname(): string {
  try {
    return new URL(siteConfig.seo.canonicalHost || 'https://degraudabola.com').hostname.replace(
      /^www\./i,
      ''
    );
  } catch {
    return 'degraudabola.com';
  }
}

const escapedHost = canonicalHostname().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const absoluteSiteHref = new RegExp(
  `^https?:\\/\\/(?:www\\.)?${escapedHost}(?=$|[/?#])`,
  'i'
);

/** CMS often ships via.placeholder “Breaking News” art — treat as missing. */
const PLACEHOLDER_IMG_SRC =
  /(?:via\.placeholder\.com|placehold\.co|placehold\.it|dummyimage\.com|(?:^|\/\/)placeholder\.com)|\bBreaking[\s+_%]*News\b/i;

/** Taller on mobile so title/excerpt fit; wider desk hero on sm+. */
export const BANNER_FRAME_CLASS =
  'aspect-[5/4] min-h-[220px] w-full overflow-hidden sm:aspect-[2/1] sm:min-h-[240px] md:aspect-[2.4/1] md:min-h-[280px]';

export function sameSitePath(href: string): string | null {
  const trimmed = href.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed.replace(/^\/noticias\//i, '/artigo/');
  }
  if (trimmed.startsWith('//')) {
    return sameSitePath(`https:${trimmed}`);
  }
  const match = trimmed.match(absoluteSiteHref);
  if (!match) return null;
  const rest = trimmed.slice(match[0].length);
  if (!rest) return '/';
  const path = rest.startsWith('/') ? rest : `/${rest}`;
  return path.replace(/^\/noticias\//i, '/artigo/');
}

export function isLikelyImageUrl(value?: string | null): boolean {
  if (!value?.trim()) return false;
  const url = value.trim();
  if (url.startsWith('data:image/')) return true;
  return /\.(avif|webp|png|jpe?g|gif|svg)(\?|#|$)/i.test(url);
}

export function isPlaceholderImageSrc(src?: string | null): boolean {
  if (!src?.trim()) return true;
  return PLACEHOLDER_IMG_SRC.test(src.trim().replace(/&amp;/g, '&'));
}

/** Strip executable bits from CMS banner HTML before iframe srcDoc. */
export function sanitizeBannerHtml(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, '')
    .replace(/<embed\b[^>]*\/?>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(["'])[\s\S]*?\1/gi, '')
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, '$1=$2#$2');
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function stripTags(value?: string): string | undefined {
  if (!value) return undefined;
  const text = decodeEntities(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  return text || undefined;
}

function matchClassContent(html: string, className: string): string | undefined {
  const re = new RegExp(
    `<[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/`,
    'i'
  );
  return stripTags(html.match(re)?.[1]);
}

export type ParsedCmsBanner = {
  href?: string;
  image?: string;
  title?: string;
  excerpt?: string;
  category?: string;
  meta?: string;
};

/** Pull fields from Brazil CMS editorial HTML so we can render a native responsive slide. */
export function parseCmsBannerHtml(html: string): ParsedCmsBanner | null {
  const cleaned = sanitizeBannerHtml(html);
  const hrefRaw = cleaned.match(/<a\b[^>]*\bhref\s*=\s*(["'])([\s\S]*?)\1/i)?.[2];
  const imageRaw = cleaned.match(/<img\b[^>]*\bsrc\s*=\s*(["'])([\s\S]*?)\1/i)?.[2];
  const title =
    matchClassContent(cleaned, 'banner-title') ||
    stripTags(cleaned.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i)?.[1]);
  const excerpt = matchClassContent(cleaned, 'banner-excerpt');
  const category = matchClassContent(cleaned, 'banner-category');
  const meta = matchClassContent(cleaned, 'banner-meta');

  if (!title && !imageRaw && !excerpt) return null;

  const hrefDecoded = hrefRaw ? decodeEntities(hrefRaw) : undefined;
  const local = hrefDecoded ? sameSitePath(hrefDecoded) : null;
  const imageDecoded = imageRaw ? decodeEntities(imageRaw) : undefined;

  return {
    href: local || hrefDecoded,
    image: imageDecoded && !isPlaceholderImageSrc(imageDecoded) ? imageDecoded : undefined,
    title,
    excerpt,
    category,
    meta,
  };
}

/** Fit one slide into the hero frame — last-resort iframe path only. */
export const BANNER_FIT_STYLE = `<style>
*{box-sizing:border-box}
html,body{margin:0;width:100%;height:100%;max-width:100%;overflow:hidden!important;background:#071A14}
.banner-slider,.banner-slide,.banner-link,.banner-image-wrapper{
  height:100%!important;width:100%!important;max-width:100%!important;max-height:100%!important;
  aspect-ratio:auto!important;margin:0!important;border:0!important;
  border-radius:0!important;box-shadow:none!important;overflow:hidden!important
}
.banner-image-wrapper{position:relative!important;background:#071A14!important}
.banner-image-wrapper img,.banner-slide img{width:100%!important;height:100%!important;object-fit:cover!important;display:block}
.banner-overlay{
  position:absolute!important;inset:0!important;
  background:linear-gradient(180deg,rgba(7,26,20,.35) 0%,rgba(7,26,20,.55) 45%,rgba(7,26,20,.88) 100%)!important;
  pointer-events:none!important
}
.banner-content,.banner-text{
  position:absolute!important;inset:auto 0 0 0!important;max-width:100%!important;overflow:hidden!important;
  display:flex!important;flex-direction:column!important;justify-content:flex-end!important;
  padding:14% 14% 12%!important;color:#fff!important;text-shadow:0 8px 24px rgba(0,0,0,.55)!important
}
.banner-slide ~ .banner-slide{display:none!important}
</style>`;

/** Rewrite same-site article links to `/artigo/...` and open in top window. */
export function prepareBannerHtml(html: string): string {
  const cleaned = sanitizeBannerHtml(html);
  return cleaned.replace(/<a\b([^>]*?)>/gi, (full, attrs: string) => {
    const hrefMatch = attrs.match(/\bhref\s*=\s*(["'])([\s\S]*?)\1/i);
    if (!hrefMatch) return full;
    const path = sameSitePath(hrefMatch[2].replace(/&amp;/g, '&'));
    if (!path) return full;
    const quote = hrefMatch[1];
    let next = attrs.replace(hrefMatch[0], `href=${quote}${path}${quote}`);
    if (/\btarget\s*=/i.test(next)) {
      next = next.replace(/\btarget\s*=\s*(["'])[\s\S]*?\1/i, 'target="_top"');
    } else {
      next += ' target="_top"';
    }
    return `<a${next}>`;
  });
}
