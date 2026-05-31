// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { describe, expect, it, vi } from 'vitest';

/*
 * The real <Island> needs HubSpot's build-time loader; mock it to render the
 * island module inline so the SSR output (TOC included) is testable here.
 */
vi.mock('@hubspot/cms-components', () => ({
  Island: ({
    module: Mod,
    wrapperTag: Tag = 'div',
    wrapperClassName,
    toc,
  }: {
    module: ComponentType<{ toc: unknown }>;
    wrapperTag?: keyof JSX.IntrinsicElements;
    wrapperClassName?: string;
    toc: unknown;
  }) => (
    <Tag className={wrapperClassName}>
      <Mod toc={toc} />
    </Tag>
  ),
}));

import type { Article } from '@/interfaces';

import { BlogArticle } from './component';

function makeArticle(overrides: Partial<Article> = {}): Article {
  return {
    title: 'Building with HubSpot',
    blogName: 'Sariyanta Blog',
    useFeaturedImage: true,
    featuredImage: 'https://cdn.example.com/hero.jpg',
    featuredImageAltText: 'A laptop on a desk',
    featuredImageWidth: 1200,
    featuredImageHeight: 675,
    author: {
      displayName: 'Jane Doe',
      avatar: 'https://cdn.example.com/jane.jpg',
    },
    publishDateFormatted: 'May 30, 2026',
    publishDateISO: '2026-05-30',
    tags: [
      { name: 'HubSpot', url: 'https://blog.example.com/tag/hubspot' },
      { name: 'CMS', url: 'https://blog.example.com/tag/cms' },
    ],
    postBody: '<p>First paragraph of the post.</p>',
    ...overrides,
  };
}

function renderArticle(overrides: Partial<Article> = {}) {
  return render(
    <BlogArticle
      fieldValues={{}}
      hublParameters={{ article: makeArticle(overrides) }}
    />,
  );
}

describe('BlogArticle', () => {
  it('renders the title as a level-1 heading', () => {
    renderArticle({ title: 'My First Post' });

    expect(
      screen.getByRole('heading', { level: 1, name: 'My First Post' }),
    ).toBeInTheDocument();
  });

  it('renders the featured image with its alt text when enabled', () => {
    renderArticle({
      useFeaturedImage: true,
      featuredImage: 'https://cdn.example.com/hero.jpg',
      featuredImageAltText: 'A laptop on a desk',
    });

    const img = screen.getByRole('img', { name: 'A laptop on a desk' });
    expect(img).toHaveAttribute('src', 'https://cdn.example.com/hero.jpg');
  });

  it('renders no featured image when the flag is off', () => {
    renderArticle({ useFeaturedImage: false });

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders no featured image when the url is empty', () => {
    renderArticle({ useFeaturedImage: true, featuredImage: '' });

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders the publish date in a machine-readable <time> element', () => {
    renderArticle({
      publishDateFormatted: 'May 30, 2026',
      publishDateISO: '2026-05-30',
    });

    const time = screen.getByText('May 30, 2026');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('datetime', '2026-05-30');
  });

  it('renders the author name and an initials fallback in the byline', () => {
    renderArticle({ author: { displayName: 'Jane Doe', avatar: '' } });

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders the byline without an author when none is set', () => {
    renderArticle({
      author: undefined,
      publishDateFormatted: 'May 30, 2026',
    });

    // Date still shows; no avatar/byline name is rendered.
    expect(screen.getByText('May 30, 2026')).toBeInTheDocument();
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
  });

  it('renders a link per tag pointing at its url', () => {
    renderArticle({
      tags: [
        { name: 'HubSpot', url: 'https://blog.example.com/tag/hubspot' },
        { name: 'CMS', url: 'https://blog.example.com/tag/cms' },
      ],
    });

    expect(screen.getByRole('link', { name: 'HubSpot' })).toHaveAttribute(
      'href',
      'https://blog.example.com/tag/hubspot',
    );
    expect(screen.getByRole('link', { name: 'CMS' })).toHaveAttribute(
      'href',
      'https://blog.example.com/tag/cms',
    );
  });

  it('renders no tag links when there are no tags', () => {
    renderArticle({ tags: [] });

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders the post body html', () => {
    renderArticle({ postBody: '<h2>A Section</h2><p>Body paragraph.</p>' });

    expect(
      screen.getByRole('heading', { level: 2, name: 'A Section' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Body paragraph.')).toBeInTheDocument();
  });

  it('shows the first tag name as the eyebrow', () => {
    renderArticle({
      tags: [
        { name: 'Tutorials', url: 'https://blog.example.com/tag/tutorials' },
      ],
    });

    expect(
      screen.getByText('Tutorials', { selector: '[data-section]' }),
    ).toBeInTheDocument();
  });

  it('falls back to the blog name for the eyebrow when there are no tags', () => {
    renderArticle({ tags: [], blogName: 'My Dev Blog' });

    expect(
      screen.getByText('My Dev Blog', { selector: '[data-section]' }),
    ).toBeInTheDocument();
  });

  it('renders the body opening paragraph as the lead', () => {
    renderArticle({
      postBody: '<p>The lead paragraph.</p><p>Body continues.</p>',
    });

    expect(screen.getByText('The lead paragraph.')).toBeInTheDocument();
  });

  it('does not repeat the opening paragraph in the prose body', () => {
    renderArticle({
      postBody: '<p>Only-once intro.</p><p>Body continues.</p>',
    });

    expect(screen.getAllByText('Only-once intro.')).toHaveLength(1);
  });

  it('lifts a leading heading and paragraph into the header, starting the TOC at the next section', () => {
    renderArticle({
      postBody:
        '<h2>Introduction</h2><p>Lead text.</p><h2>Overview</h2><p>x</p>',
    });

    // Header shows the lifted heading and lead.
    expect(
      screen.getByRole('heading', { name: 'Introduction' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Lead text.')).toBeInTheDocument();

    // The TOC starts at the next section, not the lifted heading.
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute(
      'href',
      '#overview',
    );
    expect(
      screen.queryByRole('link', { name: 'Introduction' }),
    ).not.toBeInTheDocument();
  });

  it('renders an "On this page" table of contents linking to body headings', () => {
    renderArticle({
      postBody: '<p>Intro.</p><h2>Overview</h2><p>x</p><h3>Details</h3>',
    });

    expect(
      screen.getByRole('heading', { name: /on this page/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute(
      'href',
      '#overview',
    );
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute(
      'href',
      '#details',
    );
  });

  it('renders no table of contents when the body has no headings', () => {
    renderArticle({ postBody: '<p>Just prose, no headings.</p>' });

    expect(
      screen.queryByRole('heading', { name: /on this page/i }),
    ).not.toBeInTheDocument();
  });
});
