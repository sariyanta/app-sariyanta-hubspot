import { describe, expect, it } from 'vitest';

import { getInitials } from './get-initials';

describe('getInitials', () => {
  it.each([
    ['Jane Doe', 'JD'],
    ['Sariyanta', 'S'],
    ['jane doe', 'JD'],
    ['Jane Mary Doe', 'JD'],
    ['  Jane   Doe  ', 'JD'],
    ['', ''],
    ['   ', ''],
  ])('maps %j to %j', (input, expected) => {
    expect(getInitials(input)).toBe(expected);
  });
});
