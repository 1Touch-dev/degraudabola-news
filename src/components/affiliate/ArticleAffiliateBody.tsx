'use client';

import { useEffect, useRef, useState } from 'react';
import AffiliateBanner from './AffiliateBanner';

/** The stretched rail ends with the body, before reactions and related stories. */
export default function ArticleAffiliateBody({
  html,
  className,
  align = 'center',
}: {
  html: string;
  className: string;
  /** `start` left-aligns the reading column (media-rich); `center` matches article-content-shell. */
  align?: 'center' | 'start';
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [showRail, setShowRail] = useState(true);
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const observer = new ResizeObserver(() => setShowRail(body.getBoundingClientRect().height >= 500));
    observer.observe(body);
    return () => observer.disconnect();
  }, [html]);
  const readingColumn =
    showRail
      ? 'min-w-0 w-full'
      : align === 'start'
        ? 'min-w-0 w-full max-w-3xl'
        : 'mx-auto min-w-0 w-full max-w-3xl';
  return (
    <div
      className={`article-affiliate-body mt-8 grid min-w-0 items-stretch gap-8 ${
        showRail ? 'lg:grid-cols-[minmax(0,1fr)_250px]' : ''
      }`}
    >
      {/* Wrapper owns max-width so prose `max-w-none` cannot expand past the reading column. */}
      <div className={readingColumn}>
        <div
          ref={bodyRef}
          className={`min-w-0 w-full ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      {showRail ? (
        <div className="hidden min-w-0 lg:block">
          <div className="sticky top-24">
            <AffiliateBanner preset="vertical" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
