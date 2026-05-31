/**
 * Initials for an author avatar fallback: first letter of the first and last
 * name tokens, uppercased. Single-word names yield one letter; blank input
 * yields an empty string.
 */
export function getInitials(displayName: string): string {
  const tokens = displayName.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return '';

  const first = tokens[0][0];
  const last = tokens.length > 1 ? tokens[tokens.length - 1][0] : '';

  return (first + last).toUpperCase();
}
