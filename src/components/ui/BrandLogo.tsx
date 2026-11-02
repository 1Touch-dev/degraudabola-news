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
  const initials = siteConfig.siteName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={href} className={cn('flex min-w-0 items-center gap-3', className)}>
      {!failed ? (
        <span className="relative inline-flex size-12 shrink-0 items-center justify-center rounded-[18px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),rgba(255,255,255,0.05))] shadow-[0_12px_28px_rgba(15,23,42,0.18)] backdrop-blur-sm">
          <span className="absolute inset-0 rounded-[18px] bg-[linear-gradient(135deg,rgba(46,125,50,0.18),rgba(125,42,232,0.10))]" />
          <Image
            src="/logo.png"
            alt={`Logo ${siteConfig.siteName}`}
            width={40}
            height={40}
            className={cn('relative z-10 size-10 shrink-0 object-contain', imageClassName)}
            priority
            onError={() => setFailed(true)}
          />
        </span>
      ) : (
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-[18px] border border-primary/15 bg-[linear-gradient(135deg,rgba(46,125,50,0.16),rgba(125,42,232,0.12))] font-heading text-sm font-bold text-primary shadow-[0_12px_28px_rgba(15,23,42,0.12)]">
          {initials}
        </span>
      )}
      <span className="min-w-0">
        <p className={cn('truncate font-semibold', textClassName)}>{siteConfig.siteName}</p>
        {showTagline && siteConfig.tagline ? (
          <p className="truncate text-[10px] uppercase tracking-[0.24em] text-current/65">
            {siteConfig.tagline}
          </p>
        ) : null}
      </span>
    </Link>
  );
}