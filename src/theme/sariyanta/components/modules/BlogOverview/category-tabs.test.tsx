// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Category } from '@/interfaces';

import { CategoryTabs } from './category-tabs';

function makeCategory(overrides: Partial<Category> = {}): Category {
  return {
    label: 'All Posts',
    url: 'https://blog.example.com/blog',
    isActive: false,
    ...overrides,
  };
}

describe('CategoryTabs', () => {
  it('renders a link per category pointing at its url', () => {
    render(
      <CategoryTabs
        categories={[
          makeCategory({ label: 'All Posts', url: '/blog' }),
          makeCategory({ label: 'HubSpot', url: '/blog/tag/hubspot' }),
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'All Posts' })).toHaveAttribute(
      'href',
      '/blog',
    );
    expect(screen.getByRole('link', { name: 'HubSpot' })).toHaveAttribute(
      'href',
      '/blog/tag/hubspot',
    );
  });

  it('marks the active category with aria-current and leaves others unmarked', () => {
    render(
      <CategoryTabs
        categories={[
          makeCategory({ label: 'All Posts', isActive: true }),
          makeCategory({ label: 'HubSpot', isActive: false }),
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'All Posts' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'HubSpot' })).not.toHaveAttribute(
      'aria-current',
    );
  });
});
