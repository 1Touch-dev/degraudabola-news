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
  label = 'Sem imagem',
  objectFit = 'cover',
}: FallbackMediaProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          'relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#071A14_0%,#146C43_55%,#0F2A20_100%)] text-center',
          fallbackClassName,
          className
        )}
        role="img"
        aria-label={label}
      >
        <Image
          src="/logo.png"
          alt=""
          width={96}
          height={96}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.18]"
          aria-hidden
        />
        <span className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
          {label}
        </span>
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
      className={cn(objectFit === 'contain' ? 'object-contain' : 'object-cover', className)}
      onError={() => setFailed(true)}
    />
  );
}
