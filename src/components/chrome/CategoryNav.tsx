'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { resolveChrome } from '@/lib/chrome';
import { cn } from '@/lib/utils';

const ESSENTIAL_LINKS = [
  { href: '/', label: 'Início', match: (path: string) => path === '/' },
  {
    href: '/news',
    label: 'Notícias',
    match: (path: string) => path === '/news' || path.startsWith('/artigo/'),
  },
  {
    href: '/categoria/serie-b',
    label: 'Série B',
    match: (path: string) => path === '/categoria/serie-b' || path === '/liga/serie-b',
  },
  {
    href: '/categoria/acesso',
    label: 'Acesso',
    match: (path: string) => path === '/categoria/acesso',
  },
  {
    href: '/futebol',
    label: 'Partidas',
    match: (path: string) => path === '/futebol' || path.startsWith('/liga/'),
  },
  {
    href: '/ao-vivo',
    label: 'Ao vivo',
    match: (path: string) => path.startsWith('/ao-vivo'),
  },
  {
    href: '/categoria/tabela',
    label: 'Tabela',
    match: (path: string) => path === '/categoria/tabela',
  },
] as const;

/** Compact category rail — essentials only */
export default function CategoryNav() {
  const pathname = usePathname();
  const chrome = resolveChrome().header;

  if (chrome.navPosition === 'none' || chrome.navPosition === 'inside-main') {
    return null;
  }

  const dark = chrome.surface === 'dark';

  const linkClass = (active: boolean) =>
    cn(
      'inline-flex min-h-9 shrink-0 items-center border-b-2 px-2.5 text-[11px] font-semibold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
      active
        ? 'border-accent bg-primary text-white focus-visible:outline-accent'
        : dark
          ? 'border-transparent text-white/85 hover:bg-white/10 hover:text-white focus-visible:outline-accent'
          : 'border-transparent text-secondary hover:bg-primary/10 hover:text-primary focus-visible:outline-primary'
    );

  return (
    <nav
      className={cn(
        'border-b',
        dark ? 'border-white/10 bg-pitch-night' : 'border-black/10 bg-background'
      )}
      aria-label="Categorias"
    >
      <div className="mx-auto flex w-full min-w-0 max-w-7xl items-center gap-0.5 overflow-x-auto overscroll-x-contain px-3 py-1 scrollbar-hide md:px-4">
        {ESSENTIAL_LINKS.map((item) => (
          <Link key={item.href} href={item.href} className={linkClass(item.match(pathname))}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
