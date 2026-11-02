'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FallbackMediaProps {
  src?: string;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  fallbackClassName?: string;
  label?: string;
}

export default function FallbackMedia({
  src,
  alt = '',
  fill,
  width,
  height,
  sizes,
  priority,
  className,
  fallbackClassName,
  label = 'Sem imagem',
}: FallbackMediaProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          'flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,rgba(11,61,46,0.12),rgba(125,42,232,0.12))] text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted',
          fallbackClassName,
          className
        )}
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/80 font-heading text-sm text-primary shadow-sm">
          DB
        </span>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}