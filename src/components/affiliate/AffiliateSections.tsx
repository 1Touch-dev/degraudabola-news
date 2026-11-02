import { Children, Fragment, type ReactNode } from 'react';
import AffiliateBanner from './AffiliateBanner';

/** Only place wide ads between populated sections, never after the final section. */
export default function AffiliateSections({ children, enabled = true }: { children: ReactNode; enabled?: boolean }) {
  const sections = Children.toArray(children);
  return <>{sections.map((section, index) => (
    <Fragment key={(section as { key?: string }).key ?? index}>
      {section}
      {enabled && (index + 1) % 2 === 0 && index < sections.length - 1 && (
        <div className="affiliate-placement col-span-full min-w-0 py-6">
          <AffiliateBanner preset={index % 4 === 1 ? 'landscape' : 'strip'} />
        </div>
      )}
    </Fragment>
  ))}</>;
}
