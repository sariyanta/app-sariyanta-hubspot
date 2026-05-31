import { ModuleProps } from '@hubspot/cms-components';

import { Container } from '@/components/ui/container';
import type { BlogPostSummary } from '@/interfaces';

import BlogOverviewFieldsType from './fields.type';
import { extractExcerpt } from './utils';

interface BlogOverviewProps extends Omit<
  ModuleProps<BlogOverviewFieldsType>,
  'hublParameters'
> {
  hublParameters: {
    posts: BlogPostSummary[];
  };
}

export const BlogOverview = ({ hublParameters }: BlogOverviewProps) => {
  const { posts } = hublParameters;

  if (posts.length === 0) {
    return (
      <Container className="py-24 text-center">
        <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
          No posts yet
        </p>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      {/*
        Text-only bordered grid (modelled on vercel.com/press): a 1px frame on
        the top-left of the container plus a right/bottom border on every cell
        draws the dividers, and the cells collapse to a single column on mobile.
      */}
      <div className="grid grid-cols-1 border-t border-l border-border md:grid-cols-2">
        {posts.map((post) => {
          const eyebrow = post.tags[0] ?? post.blogName;
          const excerpt = extractExcerpt(
            post.metaDescription,
            post.postSummary,
          );

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
    </Container>
  );
};

export const Component = BlogOverview;
