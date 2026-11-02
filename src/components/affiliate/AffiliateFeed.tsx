import { Children, Fragment, type ReactNode } from 'react';
import AffiliateBanner from './AffiliateBanner';

/** Count real entries, so short and empty feeds do not reserve extra ad slots. */
export default function AffiliateFeed({ children, className = '', mode = 'list', offset = 0, as = 'div' }: {
  children: ReactNode;
  className?: string;
  mode?: 'list' | 'grid';
  offset?: number;
  as?: 'div' | 'ul' | 'ol';
}) {
  const entries = Children.toArray(children);
  const Tag = as;
  const Slot = as === 'div' ? 'div' : 'li';
  return (
    <Tag className={`affiliate-feed ${className}`} data-affiliate-layout={mode}>
      {entries.map((entry, index) => {
        const completed = index + 1 + offset;
        const slot = Math.floor(completed / 6) - 1;
        const preset = mode === 'grid' && slot % 3 === 0
          ? 'card' : slot % 2 === 0 ? 'landscape' : 'strip';
        return (
          <Fragment key={(entry as { key?: string }).key ?? index}>
            {entry}
            {completed % 6 === 0 && (
              <Slot className={`affiliate-placement min-w-0 py-6 ${preset === 'card' ? 'affiliate-card-slot' : 'col-span-full'}`}>
                <AffiliateBanner preset={preset} />
              </Slot>
            )}
          </Fragment>
        );
      })}
    </Tag>
  );
}
