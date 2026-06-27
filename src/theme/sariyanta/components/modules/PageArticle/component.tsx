import { Island, ModuleProps } from '@hubspot/cms-components';

import { buildTableOfContents, highlightCodeBlocks } from '@/common';
import TableOfContentsIsland from '@/common/toc?island';
import { Container } from '@/components/ui/container';

import PageArticleFieldsType from './fields.type';

export const PageArticle = ({
  fieldValues,
}: ModuleProps<PageArticleFieldsType>) => {
  const { eyebrow, title, post_body } = fieldValues;
  const { html, toc } = buildTableOfContents(post_body);
  const highlightedHtml = highlightCodeBlocks(html);

  return (
    <Container className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_var(--container-2xs)]">
      <article className="pt-10 pb-24">
        {eyebrow && (
          <p
            data-section
            className="flex items-center gap-2 font-mono text-xs/6 font-medium tracking-widest text-muted-foreground uppercase"
          >
            {eyebrow}
          </p>
        )}

        {title && (
          <h1 className="mt-2 text-3xl font-medium tracking-tight text-foreground text-balance">
            {title}
          </h1>
        )}

        <div
          className="prose mt-10 [&_h2]:scroll-mt-20 [&_h3]:scroll-mt-20"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
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
    </Container>
  );
};

export const Component = PageArticle;
