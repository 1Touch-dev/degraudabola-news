'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import AffiliateBanner from './AffiliateBanner';

export default function AffiliatePageBanner({ children }: { children?: ReactNode }) {
  const pathname = usePathname();
  if (/^\/(?:about|contact|sobre|contato)(?:\/|$)/.test(pathname)) return null;
  return (
    <div className="mx-auto max-w-7xl px-4 pt-4">
      {children}
      <AffiliateBanner preset="strip" className="my-4" />
    </div>
  );
}
