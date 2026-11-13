/* eslint-disable @next/next/no-img-element */
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/utils';

type BrandFallbackProps = {
  className?: string;
  /** Soften the mark for large hero slots. */
  muted?: boolean;
  /** Show site name under the logo (banner image fallback). */
  labeled?: boolean;
};

/** Media-slot fallback: logo centered, website name underneath — never “Breaking News”. */
export default function BrandFallback({
  className,
  muted = false,
  labeled = false,
}: BrandFallbackProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-[linear-gradient(145deg,#071A14_0%,#146C43_55%,#0F2A20_100%)] px-6 text-center',
        className
      )}
      aria-hidden={!labeled}
      role={labeled ? 'img' : undefined}
      aria-label={labeled ? siteConfig.siteName : undefined}
    >
      <img
        src="/logo.png"
        alt={labeled ? '' : siteConfig.siteName}
        className={cn(
          'h-auto w-[42%] max-h-24 max-w-24 object-contain sm:max-h-28 sm:max-w-28',
          muted && 'opacity-80'
        )}
      />
      {labeled ? (
        <span className="max-w-[16rem] font-display text-lg uppercase tracking-[0.12em] text-white sm:text-xl">
          {siteConfig.siteName}
        </span>
      ) : null}
    </div>
  );
}
