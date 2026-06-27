// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import TableOfContents from './toc';

const TOC = [
  { id: 'overview', text: 'Overview', level: 2 as const },
  { id: 'details', text: 'Details', level: 3 as const },
];

describe('TableOfContents', () => {
  it('renders an "On this page" heading and a link per entry', () => {
    render(<TableOfContents toc={TOC} />);

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

  describe('active-heading highlight', () => {
    let fireIntersection: (
      entries: { id: string; isIntersecting: boolean }[],
    ) => void;

    beforeEach(() => {
      class MockIO {
        constructor(
          private cb: (
            e: { isIntersecting: boolean; target: Element }[],
          ) => void,
        ) {
          fireIntersection = (entries) =>
            act(() => {
              this.cb(
                entries.map((e) => ({
                  isIntersecting: e.isIntersecting,
                  target: document.getElementById(e.id) as Element,
                })),
              );
            });
        }
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
        takeRecords = vi.fn(() => []);
      }
      vi.stubGlobal('IntersectionObserver', MockIO);
      document.body.innerHTML = '<h2 id="overview"></h2><h3 id="details"></h3>';
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      document.body.innerHTML = '';
    });

    it('marks no link current before any heading is in view', () => {
      render(<TableOfContents toc={TOC} />);
      expect(
        screen.getByRole('link', { name: 'Overview' }),
      ).not.toHaveAttribute('aria-current');
    });

    it('marks the in-view heading link as current', () => {
      render(<TableOfContents toc={TOC} />);

      fireIntersection([{ id: 'details', isIntersecting: true }]);

      expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute(
        'aria-current',
        'location',
      );
      expect(
        screen.getByRole('link', { name: 'Overview' }),
      ).not.toHaveAttribute('aria-current');
    });
  });
});
