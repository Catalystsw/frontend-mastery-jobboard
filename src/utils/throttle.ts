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
  // TODO 1: Think of a window that opens on a call and closes `wait` ms later. A timer can be that window: while it is set, the window is open.
  // TODO 2: No window open → run `fn` right away and open one. That is the leading edge.
  // TODO 3: Window already open → don't run, just remember the arguments. Keep only the latest ones — each call overwrites the last.
  // TODO 4: When the window closes, if arguments were remembered, run them. Running them through `throttled` again opens a fresh window, which is exactly what you want.
  // TODO 5: `cancel` clears the timer and forgets the remembered arguments.
  throw new Error('Not implemented')
}
