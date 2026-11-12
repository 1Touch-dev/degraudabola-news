'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  href?: string;
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  showTagline?: boolean;
}

export default function BrandLogo({
  href = '/',
  className,
  imageClassName,
  textClassName,
  showTagline = true,
}: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  const compact = !showTagline;

  return (
    <Link href={href} className={cn('flex min-w-0 items-center', compact ? 'gap-2' : 'gap-3', className)}>
      {!failed ? (
        <span
          className={cn(
            'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-accent/30 bg-pitch-night shadow-[0_0_0_1px_rgba(240,180,41,0.15)]',
            compact ? 'size-9' : 'size-12'
          )}
        >
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(240,180,41,0.35),transparent_55%)]" />
          <Image
            src="/logo.png"
            alt={`Logo ${siteConfig.siteName}`}
            width={compact ? 28 : 40}
            height={compact ? 28 : 40}
            className={cn(
              'relative z-10 shrink-0 object-contain',
              compact ? 'size-7' : 'size-10',
              imageClassName
            )}
            priority
            onError={() => setFailed(true)}
          />
        </span>
      ) : (
        <span
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-md border border-accent/30 bg-pitch-night font-display text-sm font-bold text-accent',
            compact ? 'size-9' : 'size-12'
          )}
          aria-hidden
        >
          DB
        </span>
      )}
      <span className="min-w-0">
        <p className={cn('truncate font-display uppercase tracking-[0.04em]', textClassName)}>
          {siteConfig.siteName}
        </p>
        {showTagline && siteConfig.tagline ? (
          <p className="truncate text-[10px] uppercase tracking-[0.2em] text-current/65">
            {siteConfig.tagline}
          </p>
        ) : null}
      </span>
    </Link>
  );
}
