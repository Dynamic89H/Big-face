import Filter from 'bad-words';

const filter = new Filter();

/**
 * Runs text through the profanity filter.
 * Returns the filtered text plus whether anything was flagged,
 * so callers can store `is_flagged` on messages for review.
 */
export function cleanText(s: string): { text: string; flagged: boolean } {
  if (!s) return { text: s, flagged: false };
  // Note: bad-words@1.x isProfane returns the matched word (string) or false,
  // so coerce to a real boolean — callers store this in a boolean column.
  const flagged = Boolean(filter.isProfane(s));
  return { text: flagged ? filter.clean(s) : s, flagged };
}
