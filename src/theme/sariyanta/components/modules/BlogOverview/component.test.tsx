// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { BlogPostSummary, Category, Pagination } from '@/interfaces';

import { BlogOverview } from './component';

function makePost(overrides: Partial<BlogPostSummary> = {}): BlogPostSummary {
  return {
    title: 'Building with HubSpot',
    url: 'https://blog.example.com/building-with-hubspot',
    blogName: 'Sariyanta Blog',
    tags: ['HubSpot'],
    dateFormatted: 'May 30, 2026',
    dateISO: '2026-05-30',
    metaDescription: 'How we build with HubSpot.',
    postSummary: '<p>The summary paragraph. More text.</p>',
    ...overrides,
  };
}

const singlePage: Pagination = {
  currentPage: 1,
  lastPage: 1,
  prevUrl: null,
  nextUrl: null,
};

function renderOverview(
  posts: BlogPostSummary[],
  {
    categories = [],
    pagination = singlePage,
  }: { categories?: Category[]; pagination?: Pagination } = {},
) {
  return render(
    <BlogOverview
      fieldValues={{}}
      hublParameters={{ posts, categories, pagination }}
    />,
  );
}

describe('BlogOverview', () => {
  it('renders a linked cell per post pointing at its url', () => {
    renderOverview([
      makePost({ title: 'First Post', url: 'https://blog.example.com/first' }),
      makePost({
        title: 'Second Post',
        url: 'https://blog.example.com/second',
      }),
    ]);

    expect(screen.getByRole('link', { name: /First Post/ })).toHaveAttribute(
      'href',
      'https://blog.example.com/first',
    );
    expect(screen.getByRole('link', { name: /Second Post/ })).toHaveAttribute(
      'href',
      'https://blog.example.com/second',
    );
  });

  it('renders the title as a level-2 heading', () => {
    renderOverview([makePost({ title: 'A Themed Grid' })]);

    expect(
      screen.getByRole('heading', { level: 2, name: 'A Themed Grid' }),
    ).toBeInTheDocument();
  });

  it('shows the first tag name as the eyebrow', () => {
    renderOverview([makePost({ tags: ['Tutorials', 'CMS'] })]);

    expect(screen.getByText('Tutorials')).toBeInTheDocument();
  });

  it('falls back to the blog name for the eyebrow when there are no tags', () => {
    renderOverview([makePost({ tags: [], blogName: 'My Dev Blog' })]);

    expect(screen.getByText('My Dev Blog')).toBeInTheDocument();
  });

  it('renders the publish date in a machine-readable <time> element', () => {
    renderOverview([
      makePost({ dateFormatted: 'May 30, 2026', dateISO: '2026-05-30' }),
    ]);

    const time = screen.getByText('May 30, 2026');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('datetime', '2026-05-30');
  });

  it('shows the meta description as the excerpt when set', () => {
    renderOverview([
      makePost({ metaDescription: 'A crisp summary.', postSummary: '' }),
    ]);

    expect(screen.getByText('A crisp summary.')).toBeInTheDocument();
  });

  it('falls back to the post summary for the excerpt when no meta description', () => {
    renderOverview([
      makePost({
        metaDescription: '',
        postSummary: '<p>Derived lead. Tail.</p>',
      }),
    ]);

    expect(screen.getByText('Derived lead.')).toBeInTheDocument();
  });

  it('renders an empty state when there are no posts', () => {
    renderOverview([]);

    expect(screen.getByText(/no posts yet/i)).toBeInTheDocument();
  });

  it('renders the category tab row above the grid', () => {
    renderOverview([makePost()], {
      categories: [
        { label: 'All Posts', url: '/blog', isActive: true },
        { label: 'HubSpot', url: '/blog/tag/hubspot', isActive: false },
      ],
    });

    expect(
      screen.getByRole('navigation', { name: /categories/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'HubSpot' })).toHaveAttribute(
      'href',
      '/blog/tag/hubspot',
    );
  });

  it('renders pagination controls when there is more than one page', () => {
    renderOverview([makePost()], {
      pagination: {
        currentPage: 1,
        lastPage: 2,
        prevUrl: null,
        nextUrl: '/blog/page/2',
      },
    });

    expect(
      screen.getByRole('navigation', { name: /pagination/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /older/i })).toHaveAttribute(
      'href',
      '/blog/page/2',
    );
  });

  it('omits pagination controls on a single-page listing', () => {
    renderOverview([makePost()]);

    expect(
      screen.queryByRole('navigation', { name: /pagination/i }),
    ).not.toBeInTheDocument();
  });
});
