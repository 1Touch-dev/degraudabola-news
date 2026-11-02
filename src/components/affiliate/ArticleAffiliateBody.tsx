'use client';

import { useEffect, useRef, useState } from 'react';
import AffiliateBanner from './AffiliateBanner';

/** The stretched rail ends with the body, before reactions and related stories. */
export default function ArticleAffiliateBody({ html, className }: { html: string; className: string }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [showRail, setShowRail] = useState(true);
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const observer = new ResizeObserver(() => setShowRail(body.getBoundingClientRect().height >= 500));
    observer.observe(body);
    return () => observer.disconnect();
  }, [html]);
  return (
    <div className={`article-affiliate-body mt-8 grid min-w-0 items-stretch gap-8 ${showRail ? 'lg:grid-cols-[minmax(0,1fr)_250px]' : ''}`}>
      <div ref={bodyRef} className={`min-w-0 w-full ${!showRail ? 'mx-auto max-w-3xl' : ''} ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
      {showRail && <div className="hidden min-w-0 lg:block">
        <div className="sticky top-24">
          <AffiliateBanner preset="vertical" />
        </div>
      </div>}
    </div>
  );
}
