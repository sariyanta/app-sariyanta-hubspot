import type { Category } from '@/interfaces';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  categories: Category[];
}

/*
 * The category tab row above the overview grid. Auto-listed from the blog's
 * tags plus a leading "All Posts" (built in HubL), rendered as a styled link
 * row — not a client-side tabs widget, since each tab is a real navigation to a
 * tag-filtered listing served by this same module. The active tab carries
 * `aria-current="page"` and is visually distinguished.
 */
export const CategoryTabs = ({ categories }: CategoryTabsProps) => {
  return (
    <nav aria-label="Blog categories">
      <ul className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <li key={category.url}>
            <a
              href={category.url}
              aria-current={category.isActive ? 'page' : undefined}
              className={cn(
                'inline-block rounded-md px-3 py-1.5 font-mono text-xs/6 font-medium tracking-widest uppercase transition-colors',
                category.isActive
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {category.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
