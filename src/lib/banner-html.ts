import { siteConfig } from '@/lib/site-config';

const escapedHost = siteConfig.cms.websiteKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const absoluteSiteHref = new RegExp(
  `^https?:\\/\\/(?:www\\.)?${escapedHost}(?=$|[/?#])`,
  'i'
);

export const BANNER_FRAME_CLASS =
  'aspect-[21/9] min-h-[180px] w-full overflow-hidden bg-[var(--color-pitch-night,#071A14)] sm:min-h-[220px] md:min-h-[280px]';

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

/** Fit one slide into the hero frame — prefer full image, avoid harsh cropping. */
export const BANNER_FIT_STYLE = `<style>
*{box-sizing:border-box}
html,body{margin:0;width:100%;height:100%;max-width:100%;overflow:hidden!important;background:#071A14}
.banner-slider,.banner-slide,.banner-link,.banner-image-wrapper{
  height:100%!important;width:100%!important;max-width:100%!important;max-height:100%!important;
  aspect-ratio:auto!important;margin:0!important;border:0!important;
  border-radius:0!important;box-shadow:none!important;overflow:hidden!important;
  display:flex!important;align-items:center!important;justify-content:center!important
}
.banner-image-wrapper img,.banner-slide img,img{
  width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;
  object-fit:contain!important;object-position:center center!important;display:block
}
.banner-overlay,.banner-content,.banner-text{max-width:100%;overflow:hidden}
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
