import { useEffect, useState } from 'react';

/*
 * Tracks which heading is currently in view, for highlighting the matching
 * "On this page" link. Observes the elements named by `ids` and reports the
 * earliest (document-order) one that is intersecting. Client-only: it reads the
 * DOM in an effect, so it stays null during SSR until hydration.
 */
export function useActiveHeading(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const key = ids.join('|');

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const earliest = ids.find((id) => visible.has(id));
        if (earliest) setActiveId(earliest);
      },
      { rootMargin: '0px 0px -70% 0px' },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // `key` is the stable representation of `ids`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return activeId;
}
