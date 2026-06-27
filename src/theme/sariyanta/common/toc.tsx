import { useActiveHeading } from './hooks';
import type { TocEntry } from './table-of-contents';

interface TableOfContentsProps {
  toc: TocEntry[];
}

/*
 * Client island: the sticky "On this page" navigation. Highlights the link for
 * the heading currently in view (see useActiveHeading). Rendered through
 * <Island> so it hydrates on the client; SSR shows the list with nothing active.
 */
export default function TableOfContents({ toc }: TableOfContentsProps) {
  const activeId = useActiveHeading(toc.map((entry) => entry.id));

  return (
    <div className="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-y-auto px-6 pt-10 pb-24">
      <h3 className="font-mono text-xs/6 font-medium tracking-widest text-muted-foreground uppercase">
        On this page
      </h3>
      <ul className="mt-4 flex flex-col gap-2 border-l border-border">
        {toc.map((entry) => (
          <li key={entry.id} className="-ml-px flex flex-col">
            <a
              href={`#${entry.id}`}
              aria-current={entry.id === activeId ? 'location' : undefined}
              className={`inline-block border-l border-transparent text-sm/6 text-muted-foreground hover:border-foreground/25 hover:text-foreground aria-[current]:border-foreground aria-[current]:font-medium aria-[current]:text-foreground ${
                entry.level === 3 ? 'pl-8' : 'pl-4'
              }`}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
