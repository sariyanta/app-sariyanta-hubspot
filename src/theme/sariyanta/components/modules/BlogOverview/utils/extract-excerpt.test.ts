import { describe, expect, it } from 'vitest';

import { extractExcerpt } from './extract-excerpt';

describe('extractExcerpt', () => {
  it('returns the meta description when it is set', () => {
    expect(
      extractExcerpt('A hand-written summary.', '<p>Ignored body.</p>'),
    ).toBe('A hand-written summary.');
  });

  it('trims the meta description before returning it', () => {
    expect(extractExcerpt('  Spaced summary.  ', '')).toBe('Spaced summary.');
  });

  it('falls back to the first sentence of the first paragraph', () => {
    expect(extractExcerpt('', '<p>First sentence. Second sentence.</p>')).toBe(
      'First sentence.',
    );
  });

  it('discards a leading heading before taking the first paragraph', () => {
    expect(extractExcerpt('', '<h2>A Heading</h2><p>The real lead.</p>')).toBe(
      'The real lead.',
    );
  });

  it('strips inline markup from the excerpt', () => {
    expect(
      extractExcerpt('', '<p>Has a <a href="#">link</a> inside. More.</p>'),
    ).toBe('Has a link inside.');
  });

  it('returns the whole paragraph when it has no sentence break', () => {
    expect(extractExcerpt('', '<p>One sentence only.</p>')).toBe(
      'One sentence only.',
    );
  });

  it('returns an empty string when there is nothing usable', () => {
    expect(extractExcerpt('', '')).toBe('');
    expect(extractExcerpt('   ', '   ')).toBe('');
  });
});
