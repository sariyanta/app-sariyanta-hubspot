import type { Pagination } from '@/interfaces';

interface PaginationControlsProps {
  pagination: Pagination;
}

/*
 * Older/Newer pagination below the grid. HubSpot paginates newest-first, so
 * `nextUrl` (the next page) holds older posts and `prevUrl` holds newer ones.
 * Each control is omitted at its boundary (no link), and the whole row is
 * dropped when there is only one page.
 */
export const PaginationControls = ({ pagination }: PaginationControlsProps) => {
  const { lastPage, prevUrl, nextUrl } = pagination;

  if (lastPage <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between border-t border-border pt-8"
    >
      {prevUrl ? (
        <a
          href={prevUrl}
          rel="prev"
          className="font-mono text-xs/6 font-medium tracking-widest text-muted-foreground uppercase hover:text-foreground"
        >
          ← Newer
        </a>
      ) : (
        <span />
      )}
      {nextUrl ? (
        <a
          href={nextUrl}
          rel="next"
          className="font-mono text-xs/6 font-medium tracking-widest text-muted-foreground uppercase hover:text-foreground"
        >
          Older →
        </a>
      ) : (
        <span />
      )}
    </nav>
  );
};
