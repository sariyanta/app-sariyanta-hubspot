import { Island, ModuleProps } from '@hubspot/cms-components';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { badgeVariants } from '@/components/ui/badge';
import type { Article } from '@/interfaces';

import BlogArticleFieldsType from './fields.type';
import TableOfContentsIsland from './toc?island';
import { extractHeader, getInitials, buildTableOfContents } from './utils';

interface BlogArticleProps extends Omit<
  ModuleProps<BlogArticleFieldsType>,
  'hublParameters'
> {
  hublParameters: {
    article: Article;
  };
}

export const BlogArticle = ({ hublParameters }: BlogArticleProps) => {
  const { article } = hublParameters;
  const { heading, lead, body } = extractHeader(article.postBody);
  const { html, toc } = buildTableOfContents(body);
  const eyebrow = article.tags[0]?.name ?? article.blogName;

  return (
    <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-10 xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_var(--container-2xs)]">
      <article className="px-4 pt-10 pb-24 sm:px-6 xl:pr-0">
        {article.useFeaturedImage && article.featuredImage && (
          <div className="mb-10 overflow-hidden rounded-xl">
            <AspectRatio ratio={16 / 9}>
              <img
                src={article.featuredImage}
                width={article.featuredImageWidth}
                height={article.featuredImageHeight}
                alt={article.featuredImageAltText}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </AspectRatio>
          </div>
        )}

        {eyebrow && (
          <p
            data-section
            className="flex items-center gap-2 font-mono text-xs/6 font-medium tracking-widest text-muted-foreground uppercase"
          >
            {eyebrow}
          </p>
        )}

        <h1 className="mt-2 text-3xl font-medium tracking-tight text-foreground text-balance">
          {article.title}
        </h1>

        <div className="mt-4 flex items-center gap-3">
          {article.author && (
            <>
              <Avatar>
                <AvatarImage
                  src={article.author.avatar}
                  alt={article.author.displayName}
                />
                <AvatarFallback>
                  {getInitials(article.author.displayName)}
                </AvatarFallback>
              </Avatar>

              <span className="text-sm leading-none font-medium">
                {article.author.displayName}
              </span>

              <span className="text-sm text-muted-foreground">·</span>
            </>
          )}

          <time
            dateTime={article.publishDateISO}
            className="text-sm text-muted-foreground"
          >
            {article.publishDateFormatted}
          </time>
        </div>

        {heading && (
          <h2
            className="mt-8 text-xl font-medium tracking-tight text-foreground"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        )}

        {lead && (
          <p
            className="mt-6 text-base/7 text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: lead }}
          />
        )}

        {article.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <a
                key={tag.url}
                href={tag.url}
                className={badgeVariants({ variant: 'secondary' })}
              >
                {tag.name}
              </a>
            ))}
          </div>
        )}

        <div
          className="prose mt-10 [&_h2]:scroll-mt-20 [&_h3]:scroll-mt-20"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>

      {toc.length > 0 && (
        <Island
          module={TableOfContentsIsland}
          hydrateOn="idle"
          wrapperTag="div"
          wrapperClassName="max-xl:hidden"
          toc={toc}
        />
      )}
    </div>
  );
};

export const Component = BlogArticle;
