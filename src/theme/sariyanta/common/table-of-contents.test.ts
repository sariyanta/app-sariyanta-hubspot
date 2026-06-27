import { describe, expect, it } from 'vitest';

import { buildTableOfContents, slugify } from './table-of-contents';

describe('slugify', () => {
  it.each([
    ['Overview', 'overview'],
    ['Working mobile-first', 'working-mobile-first'],
    ['  Trim   me  ', 'trim-me'],
    ['Special: chars & stuff!', 'special-chars-stuff'],
  ])('maps %j to %j', (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});

describe('buildTableOfContents', () => {
  it('extracts h2 and h3 headings into a flat list with levels', () => {
    const { toc } = buildTableOfContents(
      '<h2>Overview</h2><p>x</p><h3>Details</h3>',
    );

    expect(toc).toEqual([
      { id: 'overview', text: 'Overview', level: 2 },
      { id: 'details', text: 'Details', level: 3 },
    ]);
  });

  it('injects slugified ids into the headings of the returned html', () => {
    const { html } = buildTableOfContents('<h2>Overview</h2>');

    expect(html).toContain('id="overview"');
  });

  it('preserves an id the heading already has', () => {
    const { html, toc } = buildTableOfContents('<h2 id="custom">Overview</h2>');

    expect(html).toContain('id="custom"');
    expect(toc[0].id).toBe('custom');
  });

  it('disambiguates duplicate heading slugs', () => {
    const { toc } = buildTableOfContents('<h2>Setup</h2><h2>Setup</h2>');

    expect(toc.map((e) => e.id)).toEqual(['setup', 'setup-1']);
  });

  it('ignores h1 and h4+ headings', () => {
    const { toc } = buildTableOfContents('<h1>Title</h1><h4>Aside</h4>');

    expect(toc).toEqual([]);
  });

  it('strips inline markup from heading text', () => {
    const { toc } = buildTableOfContents('<h2><code>useState</code> hook</h2>');

    expect(toc[0]).toEqual({
      id: 'usestate-hook',
      text: 'useState hook',
      level: 2,
    });
  });

  it('returns an empty toc and unchanged html when there are no headings', () => {
    const { html, toc } = buildTableOfContents('<p>Just a paragraph.</p>');

    expect(toc).toEqual([]);
    expect(html).toBe('<p>Just a paragraph.</p>');
  });
});
