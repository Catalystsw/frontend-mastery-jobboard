// throttle — runs at most once per `wait` ms, no matter how often it's called.
// Debounce waits for quiet; throttle guarantees a steady rate. On the job board this is
// the infinite-scroll handler: fire while the user keeps scrolling, but bounded.
// #note
// This version always keeps both edges: the first call runs at once (leading), and the
// last call made during a window runs when the window closes (trailing).

export interface Throttled<Args extends unknown[]> {
  (...args: Args): void
  /** Drop a pending trailing call. */
  cancel(): void
}

export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
): Throttled<Args> {
  throw new Error('Not implemented')
}
