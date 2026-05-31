import { describe, expect, it } from 'vitest';

import { extractHeader } from './extract-header';

describe('extractHeader', () => {
  it('pulls a leading heading and the first paragraph off into the header', () => {
    expect(
      extractHeader('<h2>Intro</h2><p>Lead.</p><h2>Next</h2><p>x</p>'),
    ).toEqual({
      heading: 'Intro',
      lead: 'Lead.',
      body: '<h2>Next</h2><p>x</p>',
    });
  });

  it('still extracts the lead when no heading precedes it', () => {
    expect(extractHeader('<p>Lead only.</p><h2>Next</h2>')).toEqual({
      heading: null,
      lead: 'Lead only.',
      body: '<h2>Next</h2>',
    });
  });

  it('extracts a leading heading even when no paragraph follows it', () => {
    expect(extractHeader('<h2>Heading only.</h2><h2>Next</h2>')).toEqual({
      heading: 'Heading only.',
      lead: null,
      body: '<h2>Next</h2>',
    });
  });

  it('tolerates whitespace and ignores heading/paragraph attributes', () => {
    expect(
      extractHeader('  \n<h3 id="x">Spaced</h3>\n<p class="i">Lead.</p>rest'),
    ).toEqual({
      heading: 'Spaced',
      lead: 'Lead.',
      body: 'rest',
    });
  });

  it('preserves inline markup in both the heading and the lead', () => {
    const { heading, lead } = extractHeader(
      '<h2>The <code>useState</code> hook</h2><p>Has a <a href="#">link</a>.</p>',
    );

    expect(heading).toBe('The <code>useState</code> hook');
    expect(lead).toBe('Has a <a href="#">link</a>.');
  });

  it('extracts nothing when the body starts with neither a heading nor a paragraph', () => {
    const html = '<ul><li>item</li></ul>';
    expect(extractHeader(html)).toEqual({
      heading: null,
      lead: null,
      body: html,
    });
  });

  it('returns an empty body when the post is just a heading and a paragraph', () => {
    expect(extractHeader('<h2>Title</h2><p>Only.</p>')).toEqual({
      heading: 'Title',
      lead: 'Only.',
      body: '',
    });
  });
});
