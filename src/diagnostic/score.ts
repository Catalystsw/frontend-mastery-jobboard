// #note Module 1's exercise. Twelve marks in, one address out.
// #note
// #note In lesson 5 you answered twelve diagnostic questions and marked yourself. This is the
// #note function that turns those twelve marks into the module you should open first — so the
// #note first thing you implement in this program computes your own route through it.
// #note
// #note It is deliberately small. The point is not the difficulty; it is that you have run the
// #note red → implement → diff loop once before module 3 asks you to do it under load.

/** How a run of twelve marks reads as a band. The wording matches the score slide in lesson 5. */
export type DiagnosticBand = 'starting-fresh' | 'common' | 'mid-shaped' | 'senior-shaped'

export interface DiagnosticResult {
  /** How many of the twelve you got substantially right. Scoring is binary and generous. */
  score: number
  band: DiagnosticBand
  /** The module to open next. Not always the module after this one. */
  startModule: number
  /** Where to spend the most time, in order. */
  focusModules: number[]
}

/** The diagnostic is always twelve questions — six in part 1, six in part 2. */
export const TOTAL_QUESTIONS = 12

/**
 * Turn a self-marked diagnostic into an address.
 *
 * @param marks one entry per question, `true` if you got the mechanism right.
 * @throws RangeError if the run is not exactly {@link TOTAL_QUESTIONS} long.
 */
export function scoreDiagnostic(marks: boolean[]): DiagnosticResult {
  // #hint 1 Validate first. A run that is not exactly TOTAL_QUESTIONS long is a bug in the caller, not a low score — throw a RangeError and put both numbers in the message.
  // #hint 2 The score is how many entries are `true`. `marks.filter(Boolean).length` is enough.
  // #hint 3 Four bands: 0–3, 4–6, 7–9, 10–12. Check them in order — `if (score <= 3) return …`, then `<= 6`, then `<= 9` — and whatever is left is the top band.
  // #hint 4 Each band returns its own startModule and focusModules. The table in the tests tells you the exact numbers.
  // #region solution
  if (marks.length !== TOTAL_QUESTIONS) {
    throw new RangeError(
      `scoreDiagnostic: expected ${TOTAL_QUESTIONS} marks, received ${marks.length}`,
    )
  }

  const score = marks.filter(Boolean).length

  // Shipping features, not studying the platform. Act I is the whole program for now.
  if (score <= 3) return { score, band: 'starting-fresh', startModule: 2, focusModules: [2, 3, 4] }

  // Knows React, does not yet know the browser underneath it. The most common result.
  if (score <= 6) return { score, band: 'common', startModule: 2, focusModules: [2, 3] }

  // Could survive a mid-level loop. The gap is the data layer and saying it out loud.
  if (score <= 9) return { score, band: 'mid-shaped', startModule: 8, focusModules: [8, 11, 14] }

  // Act I at 1.5x — but still do the exercises. The gap is the interview, not the knowledge.
  return { score, band: 'senior-shaped', startModule: 8, focusModules: [8, 11, 13] }
  // #endregion
}
