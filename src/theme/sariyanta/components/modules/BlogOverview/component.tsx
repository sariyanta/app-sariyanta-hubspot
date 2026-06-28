import { ModuleProps } from '@hubspot/cms-components';

import { Container } from '@/components/ui/container';
import type { BlogPostSummary, Category, Pagination } from '@/interfaces';

import { CategoryTabs } from './category-tabs';
import BlogOverviewFieldsType from './fields.type';
import { PaginationControls } from './pagination-controls';
import { extractExcerpt } from './utils';

interface BlogOverviewProps extends Omit<
  ModuleProps<BlogOverviewFieldsType>,
  'hublParameters'
> {
  hublParameters: {
    posts: BlogPostSummary[];
    categories: Category[];
    pagination: Pagination;
  };
}

// `dnd_module` instances dropped fresh in the editor (and preview renders)
// arrive without HubL params, so default every field to keep server render
// from crashing on `.length`/destructure of `undefined`.
const EMPTY_PAGINATION: Pagination = {
  currentPage: 1,
  lastPage: 1,
  prevUrl: null,
  nextUrl: null,
};

export const BlogOverview = ({ hublParameters }: BlogOverviewProps) => {
  const {
    posts = [],
    categories = [],
    pagination = EMPTY_PAGINATION,
  } = hublParameters ?? {};

  return (
    <Container className="py-16">
      {categories.length > 0 && (
        <div className="mb-10">
          <CategoryTabs categories={categories} />
        </div>
      )}

      {posts.length === 0 ? (
        <p className="py-24 text-center font-mono text-sm tracking-widest text-muted-foreground uppercase">
          No posts yet
        </p>
      ) : (
        <BlogGrid posts={posts} />
      )}

      <div className="mt-12">
        <PaginationControls pagination={pagination} />
      </div>
    </Container>
  );
};

/*
 * Text-only bordered grid (modelled on vercel.com/press): a 1px frame on the
 * top-left of the container plus a right/bottom border on every cell draws the
 * dividers, and the cells collapse to a single column on mobile.
 */
const BlogGrid = ({ posts }: { posts: BlogPostSummary[] }) => {
  return (
    <div className="grid grid-cols-1 border-t border-l border-border md:grid-cols-2">
      {posts.map((post) => {
        const eyebrow = post.tags[0] ?? post.blogName;
        const excerpt = extractExcerpt(post.metaDescription, post.postSummary);

        return (
          <a
            key={post.url}
            href={post.url}
            className="group flex flex-col border-r border-b border-border p-8 sm:p-10"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-xs/6 font-medium tracking-widest text-muted-foreground uppercase">
                {eyebrow}
                <span className="px-2" aria-hidden>
                  ·
                </span>
                <time dateTime={post.dateISO}>{post.dateFormatted}</time>
              </p>
              <span
                aria-hidden
                className="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-medium tracking-tight text-foreground text-balance">
              {post.title}
            </h2>

            {excerpt && (
              <p className="mt-3 text-base/7 text-muted-foreground">
                {excerpt}
              </p>
            )}
          </a>
        );
      })}
    </div>
  );
};

export const Component = BlogOverview;
