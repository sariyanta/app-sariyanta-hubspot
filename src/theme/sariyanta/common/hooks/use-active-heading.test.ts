// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useActiveHeading } from './use-active-heading';

interface Entry {
  id: string;
  isIntersecting: boolean;
}
let fireIntersection: (entries: Entry[]) => void;

beforeEach(() => {
  class MockIO {
    constructor(
      private cb: (
        entries: { isIntersecting: boolean; target: Element }[],
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
  document.body.innerHTML = '<h2 id="a"></h2><h2 id="b"></h2><h2 id="c"></h2>';
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

describe('useActiveHeading', () => {
  it('starts with no active heading', () => {
    const { result } = renderHook(() => useActiveHeading(['a', 'b', 'c']));
    expect(result.current).toBeNull();
  });

  it('activates a heading once it intersects', () => {
    const { result } = renderHook(() => useActiveHeading(['a', 'b', 'c']));
    fireIntersection([{ id: 'b', isIntersecting: true }]);
    expect(result.current).toBe('b');
  });

  it('prefers the earliest heading in document order when several are visible', () => {
    const { result } = renderHook(() => useActiveHeading(['a', 'b', 'c']));
    fireIntersection([
      { id: 'c', isIntersecting: true },
      { id: 'b', isIntersecting: true },
    ]);
    expect(result.current).toBe('b');
  });

  it('moves to the next visible heading when the active one scrolls out', () => {
    const { result } = renderHook(() => useActiveHeading(['a', 'b', 'c']));
    fireIntersection([
      { id: 'a', isIntersecting: true },
      { id: 'b', isIntersecting: true },
    ]);
    expect(result.current).toBe('a');

    fireIntersection([{ id: 'a', isIntersecting: false }]);
    expect(result.current).toBe('b');
  });

  it('stays inert when there are no ids', () => {
    const { result } = renderHook(() => useActiveHeading([]));
    expect(result.current).toBeNull();
  });
});
