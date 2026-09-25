// visibleRange — the cheapest optimisation there is: stop doing the work.
// Rasmi's results list holds 600 job cards. Roughly twelve of them are on screen.
// This function answers "which twelve, and how far down the page do they start?"
// It is pure arithmetic — no DOM, no React — which is exactly why it is testable.

export interface VisibleRangeInput {
  /** How far the scroll container has been scrolled, in pixels. */
  scrollTop: number
  /** The height of the scroll container itself, in pixels. */
  viewportHeight: number
  /** Every row is the same height in this stage. Variable heights are module 7. */
  rowHeight: number
  /** How many rows exist in total. */
  count: number
  /** Extra rows rendered above and below the viewport, so a fast scroll never shows a gap. */
  overscan?: number
}

export interface VisibleRange {
  /** First row to render, inclusive. */
  startIndex: number
  /** Last row to render, inclusive. `-1` when there is nothing to render. */
  endIndex: number
  /** Pixels to push the rendered rows down by, so the scrollbar stays honest. */
  offsetY: number
  /** Height of the full list, rendered or not — this is what gives the scrollbar its size. */
  totalHeight: number
}

export function visibleRange({
  scrollTop,
  viewportHeight,
  rowHeight,
  count,
  overscan = 3,
}: VisibleRangeInput): VisibleRange {
  // TODO 1: Guard first: with no rows, or a row height of 0 (the first render, before layout), return the empty range `{ startIndex: 0, endIndex: -1, offsetY: 0, totalHeight: 0 }`.
  // TODO 2: The first visible row is `Math.floor(scrollTop / rowHeight)`. The last is `Math.ceil((scrollTop + viewportHeight) / rowHeight) - 1`.
  // TODO 3: Widen both by `overscan`, then clamp: never below 0, never above `count - 1`.
  // TODO 4: `offsetY` is `startIndex * rowHeight` and `totalHeight` is `count * rowHeight`.
  throw new Error('Not implemented')
}
