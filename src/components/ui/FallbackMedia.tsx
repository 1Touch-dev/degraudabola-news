'use client';

import Image from 'next/image';
import { useState } from 'react';
import BrandFallback from '@/components/ui/BrandFallback';
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
  objectFit?: 'cover' | 'contain';
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
  objectFit = 'cover',
}: FallbackMediaProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <BrandFallback
        className={cn(fallbackClassName, className)}
        labeled
      />
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
      className={cn(objectFit === 'contain' ? 'object-contain' : 'object-cover', className)}
      onError={() => setFailed(true)}
    />
  );
}
