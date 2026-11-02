/* eslint-disable @next/next/no-img-element */
import HtmlBannerFrame from './HtmlBannerFrame';
import { isLikelyImageUrl, sameSitePath } from '@/lib/banner-html';
import { siteConfig } from '@/lib/site-config';

interface CmsBanner {
  type?: string;
  title?: string;
  imageUrl?: string;
  url?: string;
  ctaUrl?: string;
  htmlContent?: string;
  isActive?: boolean;
  status?: string;
}

export default async function EditorialBanner() {
  let banner: CmsBanner | undefined;
  try {
    const base = siteConfig.cms.baseUrl.replace(/\/$/, '');
    const path = siteConfig.integrations?.BANNERS || `/banners/public/${encodeURIComponent(siteConfig.cms.websiteKey)}`;
    const response = await fetch(/^https?:\/\//.test(path) ? path : `${base}${path}`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const data = await response.json() as { banner?: CmsBanner; banners?: CmsBanner[] };
    banner = (data.banners?.length ? data.banners : [data.banner]).find((item) =>
      item && item.isActive !== false && item.status !== 'inactive' &&
      (item.type === 'html' ? item.htmlContent?.trim() : item.imageUrl || isLikelyImageUrl(item.url))
    );
  } catch {
    return null;
  }
  if (!banner) return null;
  if (banner.type === 'html' && banner.htmlContent) {
    return <HtmlBannerFrame html={banner.htmlContent} title={banner.title || 'Destaque'} />;
  }
  const image = banner.imageUrl || banner.url;
  const href = banner.ctaUrl || (!isLikelyImageUrl(banner.url) ? banner.url : undefined);
  const content = <img src={image} alt={banner.title || 'Destaque'} className="block h-auto w-full" />;
  if (!href || !/^(?:https?:\/\/|\/(?!\/))/.test(href)) return content;
  const local = sameSitePath(href);
  return <a href={local || href} {...(local ? {} : { target: '_blank', rel: 'noopener noreferrer' })}>{content}</a>;
}
