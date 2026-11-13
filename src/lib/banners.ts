import { isLikelyImageUrl } from '@/lib/banner-html';
import { siteConfig } from '@/lib/site-config';

export interface IEditorialBanner {
  _id?: string;
  type?: string;
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  htmlContent?: string;
  ctaUrl?: string;
  ctaLabel?: string;
  isActive?: boolean;
  status?: string;
}

interface BannerResponse {
  banner?: IEditorialBanner | null;
  banners?: IEditorialBanner[];
}

const base = (siteConfig.cms.baseUrl || '').replace(/\/$/, '');

const isUsable = (banner: IEditorialBanner) => {
  if (banner.isActive === false || banner.status === 'inactive') return false;
  if (banner.type === 'html') return Boolean(banner.htmlContent?.trim());
  return Boolean(banner.imageUrl?.trim() || isLikelyImageUrl(banner.url));
};

/** Public editorial heroes — Brazil CMS `GET /banners/public/{websiteKey}`. */
export async function getEditorialBanners(): Promise<IEditorialBanner[]> {
  if (!base) return [];
  try {
    const path =
      siteConfig.integrations?.BANNERS ||
      `/banners/public/${encodeURIComponent(siteConfig.cms.websiteKey)}`;
    const url = /^https?:\/\//.test(path) ? path : `${base}${path}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as BannerResponse;
    const list =
      Array.isArray(json.banners) && json.banners.length > 0 ? json.banners : [json.banner];
    return list.filter(
      (banner): banner is IEditorialBanner => Boolean(banner) && isUsable(banner as IEditorialBanner)
    );
  } catch {
    return [];
  }
}
