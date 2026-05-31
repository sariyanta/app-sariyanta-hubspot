// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Pagination } from '@/interfaces';

import { PaginationControls } from './pagination-controls';

function makePagination(overrides: Partial<Pagination> = {}): Pagination {
  return {
    currentPage: 2,
    lastPage: 3,
    prevUrl: '/blog/page/1',
    nextUrl: '/blog/page/3',
    ...overrides,
  };
}

describe('PaginationControls', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(
      <PaginationControls
        pagination={makePagination({
          currentPage: 1,
          lastPage: 1,
          prevUrl: null,
          nextUrl: null,
        })}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders Newer and Older controls linking to prev and next urls', () => {
    render(
      <PaginationControls
        pagination={makePagination({
          prevUrl: '/blog/page/1',
          nextUrl: '/blog/page/3',
        })}
      />,
    );

    expect(screen.getByRole('link', { name: /newer/i })).toHaveAttribute(
      'href',
      '/blog/page/1',
    );
    expect(screen.getByRole('link', { name: /older/i })).toHaveAttribute(
      'href',
      '/blog/page/3',
    );
  });

  it('omits the Newer control on the first page', () => {
    render(
      <PaginationControls
        pagination={makePagination({
          currentPage: 1,
          prevUrl: null,
          nextUrl: '/blog/page/2',
        })}
      />,
    );

    expect(
      screen.queryByRole('link', { name: /newer/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /older/i })).toBeInTheDocument();
  });

  it('omits the Older control on the last page', () => {
    render(
      <PaginationControls
        pagination={makePagination({
          currentPage: 3,
          prevUrl: '/blog/page/2',
          nextUrl: null,
        })}
      />,
    );

    expect(screen.getByRole('link', { name: /newer/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /older/i }),
    ).not.toBeInTheDocument();
  });
});
